"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { ShieldCheck, CheckCircle, XCircle, Eye, FileText, CarFront, Banknote, ArrowRightLeft, X, MessageCircle, Phone, Mail, Clock, AlertCircle, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

// ADDED 'maintenance' to the tabs
type TabType = 'leases' | 'rentals' | 'finance' | 'swaps' | 'maintenance';

export default function AdminPanel() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>('leases');
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  const [userLicense, setUserLicense] = useState<string | null>(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseChecked, setLicenseChecked] = useState(false);

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/dashboard");
    }
  }, [role, loading, router]);

  useEffect(() => {
    if (!viewingItem) {
      setUserLicense(null);
      setLicenseChecked(false);
    }
  }, [viewingItem]);

  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, activeTab));
      const fetchedData: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() });
      });
      fetchedData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchAllData();
    }
  }, [activeTab, role]);

  const updateStatus = async (item: any, newStatus: string) => {
    try {
      const docRef = doc(db, activeTab, item.id);
      await updateDoc(docRef, { status: newStatus });
      
      if (viewingItem && viewingItem.id === item.id) {
        setViewingItem({ ...viewingItem, status: newStatus });
      }
      fetchAllData();

      // AUTOMATED EMAIL TRIGGER
      if (item.userEmail) {
        let customMessage = "";
        let statusText = newStatus;

        if (newStatus === "Approved") {
          statusText = "Approved! 🎉";
          customMessage = "Great news! Your request has been officially approved by our team. Please check your dashboard or WhatsApp for the next steps.";
        } else if (newStatus === "Rejected") {
           statusText = "Declined ❌";
           customMessage = "Unfortunately, we could not approve your request at this time. Please contact our support team for more details.";
        }

        const serviceTypeMap: any = {
          leases: "Lease Transfer",
          rentals: "Car Rental",
          finance: "Financing Application",
          swaps: "Car Swap",
          maintenance: "Car Maintenance Service" // Added Maintenance Map
        };

        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: item.userEmail,
            userName: item.userName || "Valued Customer",
            serviceType: serviceTypeMap[activeTab] || "Request",
            status: statusText,
            customMessage: customMessage
          })
        }).catch(err => console.error("Failed to send admin email", err));
      }

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleCheckLicense = async () => {
    if (!viewingItem?.userId) return;
    setLicenseLoading(true);
    try {
      const userDocRef = doc(db, "users", viewingItem.userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().driversLicense) {
        setUserLicense(userDoc.data().driversLicense);
      } else {
        setUserLicense(null);
      }
    } catch (error) {
      console.error("Error fetching driver's license:", error);
    } finally {
      setLicenseLoading(false);
      setLicenseChecked(true);
    }
  };

  if (loading || role !== "admin") return null;

  const renderVehicleInfo = (item: any) => {
    switch (activeTab) {
      case 'leases': return <><p className="font-bold text-slate-700">{item.make} {item.model} ({item.year})</p><p className="text-xs text-slate-500">Payment: {item.monthlyPayment} ريال/mo</p></>;
      case 'rentals': return <><p className="font-bold text-slate-700">{item.make} {item.model} ({item.year})</p><p className="text-xs text-slate-500">Price: {item.dailyPrice} ريال/day</p></>;
      case 'finance': return <><p className="font-bold text-slate-700">{item.carModel}</p><p className="text-xs text-slate-500">Est. Payment: {item.estimatedMonthly || item.price} ريال</p></>;
      case 'swaps': return <><p className="font-bold text-slate-700">Has: {item.myMake} {item.myModel}</p><p className="text-xs text-purple-600 font-medium mt-0.5">Wants: {item.targetMake || 'Any'} {item.targetType || 'Any'}</p></>;
      // ADDED Maintenance Table View
      case 'maintenance': return <><p className="font-bold text-slate-700">{item.carMake} {item.carModel} ({item.year})</p><p className="text-xs text-slate-500 line-clamp-1">{item.message}</p></>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 relative">
      
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-slate-900/20">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage, verify, and approve all platform requests.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit mb-8">
        <button onClick={() => setActiveTab('leases')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'leases' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
          <FileText size={16} /> Leases
        </button>
        <button onClick={() => setActiveTab('rentals')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'rentals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
          <CarFront size={16} /> Rentals
        </button>
        <button onClick={() => setActiveTab('finance')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'finance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
          <Banknote size={16} /> Finance
        </button>
        <button onClick={() => setActiveTab('swaps')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'swaps' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
          <ArrowRightLeft size={16} /> Swaps
        </button>
        {/* ADDED Maintenance Tab */}
        <button onClick={() => setActiveTab('maintenance')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'maintenance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
          <Wrench size={16} /> Maintenance
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {dataLoading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
            Loading database...
          </div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            No {activeTab} requests found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="p-5 font-bold">User</th>
                  <th className="p-5 font-bold">Request Details</th>
                  <th className="p-5 font-bold">Date Submitted</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-slate-900">{item.userName || "Unknown User"}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {item.userId?.substring(0,8)}...</p>
                    </td>
                    <td className="p-5">{renderVehicleInfo(item)}</td>
                    <td className="p-5 text-slate-500 text-xs font-medium">
                      {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now"}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        item.status === 'Approved' || item.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 
                        item.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                        item.status === 'Pending Review' || item.status === 'Reviewing Matches' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {item.status || "Under Review"}
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button onClick={() => setViewingItem(item)} className="p-2.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 rounded-xl transition-all hover:shadow-sm" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => updateStatus(item, 'Approved')} className="p-2.5 text-slate-400 hover:text-green-600 bg-white border border-slate-200 hover:border-green-200 rounded-xl transition-all hover:shadow-sm" title="Approve">
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => updateStatus(item, 'Rejected')} className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-all hover:shadow-sm" title="Reject">
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* THE UPDATED "VIEW DETAILS" MODAL          */}
      {/* ========================================= */}
      {viewingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setViewingItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">{activeTab === 'maintenance' ? 'Service' : activeTab.slice(0, -1)} Request Details</h2>
            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              Submitted by <span className="font-bold text-slate-700">{viewingItem.userName}</span>
            </p>

            {/* DRIVER'S LICENSE VERIFICATION SECTION (Hide for maintenance as it's not strictly necessary, but good to have) */}
            {activeTab !== 'maintenance' && (
              <div className="mb-8 pb-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={18} /> Driver's License Verification
                </h3>
                
                {!licenseChecked && !licenseLoading ? (
                  <button 
                    onClick={handleCheckLicense}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 w-fit"
                  >
                    <FileText size={18} /> Check User's Driver's License
                  </button>
                ) : licenseLoading ? (
                  <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Clock className="animate-spin text-primary" size={18} /> Fetching secure file...
                  </div>
                ) : userLicense ? (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <span className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold mb-3 border border-green-100">
                      <CheckCircle size={14} className="inline mr-1" /> Verified on File
                    </span>
                    <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 relative group cursor-pointer">
                       <img src={userLicense} alt="Driver's License" className="w-full h-full object-contain" />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2">
                     <AlertCircle size={18} className="text-slate-400" /> No driver's license found on this user's profile.
                  </div>
                )}
              </div>
            )}

            {/* CONTACT ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-100">
              <a 
                href={`https://wa.me/${(viewingItem.contactNumber || "").replace(/[^0-9]/g, '')}`} 
                target="_blank" rel="noopener noreferrer"
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${viewingItem.contactNumber ? 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366]' : 'bg-slate-50 text-slate-300 cursor-not-allowed pointer-events-none'}`}
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a 
                href={`tel:${viewingItem.contactNumber}`} 
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${viewingItem.contactNumber ? 'bg-blue-50 hover:bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-300 cursor-not-allowed pointer-events-none'}`}
              >
                <Phone size={18} /> Call
              </a>
              <a 
                href={`mailto:${viewingItem.userEmail}`} 
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${viewingItem.userEmail ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-50 text-slate-300 cursor-not-allowed pointer-events-none'}`}
              >
                <Mail size={18} /> Email
              </a>
            </div>

            {/* ADDED: MULTIPLE IMAGES FOR MAINTENANCE */}
            {activeTab === 'maintenance' && viewingItem.images && viewingItem.images.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Uploaded Photos</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {viewingItem.images.map((img: string, idx: number) => (
                    <div key={idx} className="h-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={img} alt={`Issue ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SINGLE CAR IMAGE (For Swaps) */}
            {activeTab !== 'maintenance' && viewingItem.image && (
              <div className="mb-6 w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={viewingItem.image} alt="Uploaded car" className="w-full h-full object-cover" />
              </div>
            )}

            {/* FINANCE ADMIN CONTROLS */}
            {activeTab === 'finance' && viewingItem.status === 'Approved' && (
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Banknote className="text-primary" size={20} /> Financial Overview & Tracker
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Outstanding Balance (ريال)</label>
                    <div className="flex">
                      <input type="number" id="balanceAdmin" defaultValue={viewingItem.outstandingBalance} className="w-full h-10 px-3 rounded-l-lg border border-slate-300 focus:outline-none" />
                      <button onClick={async () => {
                        const val = parseFloat((document.getElementById('balanceAdmin') as HTMLInputElement).value);
                        await updateDoc(doc(db, "finance", viewingItem.id), { outstandingBalance: val });
                        alert("Outstanding Balance Updated!");
                        setViewingItem({...viewingItem, outstandingBalance: val});
                      }} className="bg-primary text-white px-3 text-sm font-bold rounded-r-lg">Save</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Paid (ريال)</label>
                    <div className="flex">
                      <input type="number" id="paidAdmin" defaultValue={viewingItem.totalPaid} className="w-full h-10 px-3 rounded-l-lg border border-slate-300 focus:outline-none" />
                      <button onClick={async () => {
                        const val = parseFloat((document.getElementById('paidAdmin') as HTMLInputElement).value);
                        await updateDoc(doc(db, "finance", viewingItem.id), { totalPaid: val });
                        alert("Total Paid Updated!");
                        setViewingItem({...viewingItem, totalPaid: val});
                      }} className="bg-green-600 hover:bg-green-700 text-white px-3 text-sm font-bold rounded-r-lg">Save</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Months Paid</label>
                    <div className="flex">
                      <input type="number" id="monthsPaidAdmin" defaultValue={viewingItem.monthsPaid} className="w-full h-10 px-3 rounded-l-lg border border-slate-300 focus:outline-none" />
                      <button onClick={async () => {
                        const val = parseInt((document.getElementById('monthsPaidAdmin') as HTMLInputElement).value);
                        await updateDoc(doc(db, "finance", viewingItem.id), { monthsPaid: val });
                        alert("Months Updated!");
                        setViewingItem({...viewingItem, monthsPaid: val});
                      }} className="bg-slate-700 text-white px-3 text-sm font-bold rounded-r-lg">Save</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Remaining Months</label>
                    <div className="flex">
                      <input type="number" id="remMonthsAdmin" defaultValue={viewingItem.remainingMonths} className="w-full h-10 px-3 rounded-l-lg border border-slate-300 focus:outline-none" />
                      <button onClick={async () => {
                        const val = parseInt((document.getElementById('remMonthsAdmin') as HTMLInputElement).value);
                        await updateDoc(doc(db, "finance", viewingItem.id), { remainingMonths: val });
                        alert("Months Updated!");
                        setViewingItem({...viewingItem, remainingMonths: val});
                      }} className="bg-slate-700 text-white px-3 text-sm font-bold rounded-r-lg">Save</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload New Receipt (PDF)</label>
                  <input type="file" accept=".pdf,image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const newReceipt = { date: new Date().toLocaleDateString(), fileName: file.name, fileData: reader.result };
                        const updatedReceipts = [...(viewingItem.receipts || []), newReceipt];
                        await updateDoc(doc(db, "finance", viewingItem.id), { receipts: updatedReceipts });
                        alert("Receipt Uploaded & Sent to User Dashboard!");
                        setViewingItem({...viewingItem, receipts: updatedReceipts});
                      };
                      reader.readAsDataURL(file);
                    }
                  }} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                </div>
              </div>
            )}

            {/* DYNAMIC DATA GRID */}
            <div className={`grid grid-cols-1 ${activeTab === 'maintenance' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-y-6 gap-x-8 mb-8`}>
              {Object.entries(viewingItem).map(([key, value]) => {
                if (key === 'id' || key === 'userId' || key === 'image' || key === 'images' || key === 'createdAt' || key === 'userEmail' || key === 'contactNumber' || key === 'receipts') return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                return (
                  <div key={key}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{formattedKey}</p>
                    <p className="font-medium text-slate-900 text-lg whitespace-pre-wrap">{String(value) || "N/A"}</p>
                  </div>
                );
              })}
            </div>

            {/* APPROVE/REJECT BUTTONS */}
            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button onClick={() => updateStatus(viewingItem, 'Approved')} className="flex-1 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={18} /> {activeTab === 'maintenance' ? 'Approve Service' : 'Approve'}
              </button>
              <button onClick={() => updateStatus(viewingItem, 'Rejected')} className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <XCircle size={18} /> Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}