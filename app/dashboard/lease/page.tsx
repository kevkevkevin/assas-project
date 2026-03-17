"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Plus, FileText, Clock, ChevronRight, ArrowLeft, UploadCloud, Image as ImageIcon, Phone } from "lucide-react";

export default function LeaseTransferPage() {
  const { user } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    contactNumber: "", // <--- ADDED!
    make: "", model: "", year: "", color: "",
    mileage: "", monthlyPayment: "", remainingMonths: "",
    transferFee: "", description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMyLeases = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "leases"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedLeases: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLeases.push({ id: doc.id, ...doc.data() });
      });
      setLeases(fetchedLeases);
    } catch (error) {
      console.error("Error fetching leases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeases();
  }, [user]);

  const handleCreateLease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "leases"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email, // <--- GRAB EMAIL!
        ...formData, 
        status: "Under Review", 
        createdAt: new Date(),
      });

      setFormData({
        contactNumber: "",
        make: "", model: "", year: "", color: "",
        mileage: "", monthlyPayment: "", remainingMonths: "",
        transferFee: "", description: ""
      });
      setView('list');
      fetchMyLeases(); 
    } catch (error) {
      console.error("Error creating lease:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full input input-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:border-primary focus:outline-none px-4";

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {view === 'list' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Lease Transfer</h1>
              <p className="text-slate-500 mt-1">Transfer your car lease or track existing transfers</p>
            </div>
            <button onClick={() => setView('form')} className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
              <Plus size={20} /> List My Car
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px] text-slate-400 font-medium">
                <Clock className="animate-spin mr-2" size={20} /> Loading your listings...
              </div>
            ) : leases.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No active lease transfers</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">You haven't listed any vehicles for lease transfer yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {leases.map((lease) => (
                  <div key={lease.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{lease.make} {lease.model} ({lease.year})</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span className="font-semibold text-slate-700">{lease.monthlyPayment} ريال</span> / month
                        <span className="text-slate-300">•</span>
                        <span>{lease.remainingMonths} months left</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">
                        {lease.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'form' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-6 transition-colors">
            <ArrowLeft size={20} /> Back to transfers
          </button>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">List Your Car for Lease Transfer</h2>

            <form onSubmit={handleCreateLease} className="space-y-8">
              
              {/* CONTACT INFO ADDED HERE */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Phone className="text-primary" size={20} /> Contact Information
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                  <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleInputChange} placeholder="e.g. +966 50 123 4567" className={inputStyles} />
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Make *</label>
                  <input type="text" name="make" required value={formData.make} onChange={handleInputChange} placeholder="e.g. Toyota" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Model *</label>
                  <input type="text" name="model" required value={formData.model} onChange={handleInputChange} placeholder="e.g. Camry" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Year *</label>
                  <input type="number" name="year" required value={formData.year} onChange={handleInputChange} placeholder="2024" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. White" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mileage</label>
                  <input type="text" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g. 15000" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Monthly Payment (ريال)</label>
                  <input type="number" name="monthlyPayment" required value={formData.monthlyPayment} onChange={handleInputChange} placeholder="e.g. 1500" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Remaining Months</label>
                  <input type="number" name="remainingMonths" required value={formData.remainingMonths} onChange={handleInputChange} placeholder="e.g. 24" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Transfer Fee (ريال)</label>
                  <input type="number" name="transferFee" value={formData.transferFee} onChange={handleInputChange} placeholder="e.g. 500" className={inputStyles} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the car and lease details..." className="w-full textarea textarea-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary focus:outline-none p-4 min-h-[120px]" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20">
                {isSubmitting ? "Submitting..." : "Submit Lease Transfer"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}