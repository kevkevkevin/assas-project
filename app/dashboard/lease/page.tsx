"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Plus, FileText, Clock, ChevronRight, ArrowLeft, UploadCloud, Image as ImageIcon, Phone } from "lucide-react";
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../../../context/LanguageContext";

export default function LeaseTransferPage() {
  const { user } = useAuth();
  // 2. INITIALIZE TRANSLATION ENGINE
  const { t } = useLanguage();

  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    contactNumber: "", 
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
        userEmail: user.email, 
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
      alert(t("failedCreateLease"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full input input-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:border-primary focus:outline-none px-4 rtl:text-right";

  return (
    <div className="max-w-5xl mx-auto pb-10 text-start">
      
      {view === 'list' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t("leaseTransferTitle")}</h1>
              <p className="text-slate-500 mt-1">{t("leaseTransferSubtitle")}</p>
            </div>
            <button onClick={() => setView('form')} className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
              <Plus size={20} /> {t("listMyCarBtn")}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px] text-slate-400 font-medium">
                <Clock className="animate-spin ltr:mr-2 rtl:ml-2" size={20} /> {t("loadingListings")}
              </div>
            ) : leases.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-primary mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t("noActiveLease")}</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">{t("noActiveLeaseDesc")}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {leases.map((lease) => (
                  <div key={lease.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{lease.make} {lease.model} ({lease.year})</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span className="font-semibold text-slate-700">{lease.monthlyPayment} {t("currencySAR")}</span> / {t("perMonthText")}
                        <span className="text-slate-300">•</span>
                        <span>{lease.remainingMonths} {t("monthsLeft")}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">
                        {/* Translate standard statuses if they match, else display raw */}
                        {lease.status === "Under Review" ? t("underReview") : lease.status}
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
            <ArrowLeft size={20} className="rtl:rotate-180" /> {t("backToTransfers")}
          </button>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t("listCarTitle")}</h2>

            <form onSubmit={handleCreateLease} className="space-y-8">
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Phone className="text-primary" size={20} /> {t("contactInfo")}
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("mobileNumber")}</label>
                  <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleInputChange} placeholder="e.g. +966 50 123 4567" className={inputStyles} dir="ltr" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("makeReq")}</label>
                  <input type="text" name="make" required value={formData.make} onChange={handleInputChange} placeholder={t("egToyota")} className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("modelReq")}</label>
                  <input type="text" name="model" required value={formData.model} onChange={handleInputChange} placeholder={t("egCamry")} className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("yearReq")}</label>
                  <input type="number" name="year" required value={formData.year} onChange={handleInputChange} placeholder="2024" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("colorLabel")}</label>
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} placeholder={t("egWhite")} className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("mileageLabel")}</label>
                  <input type="text" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g. 15000" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("monthlyPaymentSAR")}</label>
                  <input type="number" name="monthlyPayment" required value={formData.monthlyPayment} onChange={handleInputChange} placeholder="e.g. 1500" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("remainingMonthsLabel")}</label>
                  <input type="number" name="remainingMonths" required value={formData.remainingMonths} onChange={handleInputChange} placeholder="e.g. 24" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("transferFeeSAR")}</label>
                  <input type="number" name="transferFee" value={formData.transferFee} onChange={handleInputChange} placeholder="e.g. 500" className={inputStyles} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t("descLabel")}</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder={t("descPlaceholder")} className="w-full textarea textarea-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary focus:outline-none p-4 min-h-[120px] rtl:text-right" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20">
                {isSubmitting ? t("submitting") : t("submitLease")}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}