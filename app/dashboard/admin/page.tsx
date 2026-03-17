"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { ShieldCheck, CheckCircle, XCircle, Eye, FileText, CarFront, Banknote, ArrowRightLeft, X, MessageCircle, Phone, Mail, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type TabType = 'leases' | 'rentals' | 'finance' | 'swaps';

export default function AdminPanel() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>('leases');
  const [data, setData] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [viewingItem, setViewingItem] = useState<any | null>(null);

  // NEW STATES: For checking the driver's license
  const [userLicense, setUserLicense] = useState<string | null>(null);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseChecked, setLicenseChecked] = useState(false);

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/dashboard");
    }
  }, [role, loading, router]);

  // Reset the license viewer whenever you close or change the modal
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, activeTab, id);
      await updateDoc(docRef, { status: newStatus });
      if (viewingItem && viewingItem.id === id) {
        setViewingItem({ ...viewingItem, status: newStatus });
      }
      fetchAllData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // NEW FUNCTION: Fetch the user's license from their main profile
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
      case 'finance': return <><p className="font-bold text-slate-700">{item.carModel}</p><p className="text-xs text-slate-500">Est. Payment: {item.estimatedMonthly} ريال/mo</p></>;
      case 'swaps': return <><p className="font-bold text-slate-700">Has: {item.myMake} {item.myModel}</p><p className="text-xs text-purple-600 font-medium mt-0.5">Wants: {item.targetMake || 'Any'} {item.targetType || 'Any'}</p></>;
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
                        item.status === 'Reviewing Matches' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {item.status || "Under Review"}
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button onClick={() => setViewingItem(item)} className="p-2.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 rounded-xl transition-all hover:shadow-sm" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => updateStatus(item.id, 'Approved')} className="p-2.5 text-slate-400 hover:text-green-600 bg-white border border-slate-200 hover:border-green-200 rounded-xl transition-all hover:shadow-sm" title="Approve">
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => updateStatus(item.id, 'Rejected')} className="p-2.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-xl transition-all hover:shadow-sm" title="Reject">
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
      {/* THE UPDATED "VIEW DETAILS" MODAL WITH LICENSE CHECKER */}
      {/* ========================================= */}
      {viewingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            
            <button onClick={() => setViewingItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">{activeTab.slice(0, -1)} Request Details</h2>
            <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100">
              Submitted by <span className="font-bold text-slate-700">{viewingItem.userName}</span>
            </p>

            {/* NEW: DRIVER'S LICENSE VERIFICATION SECTION */}
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
                     {/* Hover overlay for a sleek look */}
                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2">
                   <AlertCircle size={18} className="text-slate-400" /> No driver's license found on this user's profile.
                </div>
              )}
            </div>

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

            {/* CAR IMAGES (For Swaps) */}
            {viewingItem.image && (
              <div className="mb-6 w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={viewingItem.image} alt="Uploaded car" className="w-full h-full object-cover" />
              </div>
            )}

            {/* DYNAMIC DATA GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
              {Object.entries(viewingItem).map(([key, value]) => {
                if (key === 'id' || key === 'userId' || key === 'image' || key === 'createdAt' || key === 'userEmail' || key === 'contactNumber') return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                return (
                  <div key={key}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{formattedKey}</p>
                    <p className="font-medium text-slate-900 text-lg">{String(value) || "N/A"}</p>
                  </div>
                );
              })}
            </div>

            {/* APPROVE/REJECT BUTTONS */}
            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button onClick={() => updateStatus(viewingItem.id, 'Approved')} className="flex-1 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Approve
              </button>
              <button onClick={() => updateStatus(viewingItem.id, 'Rejected')} className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                <XCircle size={18} /> Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}