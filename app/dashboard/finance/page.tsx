"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Banknote, FileText, CheckCircle, Clock, UploadCloud, X, Plus, CreditCard, Download, ShieldCheck, CarFront, Wallet, TrendingDown } from "lucide-react";
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../../../context/LanguageContext";

export default function FinancePage() {
  const { user } = useAuth();
  // 2. INITIALIZE TRANSLATION ENGINE
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [activeFinance, setActiveFinance] = useState<any | null>(null);
  
  // Document States
  const [userDocs, setUserDocs] = useState({ driversLicense: false, iqama: false, gosi: false, bankStatement: false });
  const [previews, setPreviews] = useState({ driversLicense: "", iqama: "", gosi: "", bankStatement: "" });
  
  // Form State
  const [formData, setFormData] = useState({
    carMake: "", carModel: "", year: "", price: "", downPayment: "", lastPaymentMethod: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const riyalIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Saudi_Riyal_Symbol.svg/250px-Saudi_Riyal_Symbol.svg.png";

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserDocs({
          driversLicense: !!data.driversLicense,
          iqama: !!data.iqama,
          gosi: !!data.gosi,
          bankStatement: !!data.bankStatement
        });
      }

      const q = query(collection(db, "finance"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      let latestApproved = null;
      
      querySnapshot.forEach((doc) => {
        const data: any = { id: doc.id, ...doc.data() };
        if (data.status === "Approved") latestApproved = data;
      });

      if (latestApproved) {
        setActiveFinance(latestApproved);
        setIsApplying(false); 
      } else {
        setIsApplying(true); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [docType]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const updatesToUser: any = {};
      if (!userDocs.driversLicense && previews.driversLicense) updatesToUser.driversLicense = previews.driversLicense;
      if (!userDocs.iqama && previews.iqama) updatesToUser.iqama = previews.iqama;
      if (!userDocs.gosi && previews.gosi) updatesToUser.gosi = previews.gosi;
      if (!userDocs.bankStatement && previews.bankStatement) updatesToUser.bankStatement = previews.bankStatement;

      if (Object.keys(updatesToUser).length > 0) {
        await updateDoc(doc(db, "users", user.uid), updatesToUser);
        setUserDocs({
          driversLicense: userDocs.driversLicense || !!previews.driversLicense,
          iqama: userDocs.iqama || !!previews.iqama,
          gosi: userDocs.gosi || !!previews.gosi,
          bankStatement: userDocs.bankStatement || !!previews.bankStatement,
        });
      }

      // CALCULATE INITIAL FINANCE NUMBERS
      const vehiclePrice = parseFloat(formData.price) || 0;
      const downPay = parseFloat(formData.downPayment) || 0;
      const initialBalance = vehiclePrice - downPay;

      await addDoc(collection(db, "finance"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        ...formData,
        status: "Pending",
        monthsPaid: 0,
        remainingMonths: 60, 
        totalPaid: downPay,                
        outstandingBalance: initialBalance, 
        receipts: [],
        createdAt: new Date(),
      });

      alert(t("financeAppSuccess"));
      setFormData({ carMake: "", carModel: "", year: "", price: "", downPayment: "", lastPaymentMethod: "" });
      fetchData(); 

    } catch (error) {
      console.error(error);
      alert(t("financeAppFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full input input-bordered bg-slate-50 text-slate-900 h-12 rounded-xl focus:border-primary focus:outline-none px-4 border-slate-200";

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">{t("financeLoading")}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10 text-start">
      
      {/* ========================================= */}
      {/* THE APPROVED DASHBOARD VIEW                 */}
      {/* ========================================= */}
      {!isApplying && activeFinance && (
        <div className="animate-in fade-in duration-500">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 text-primary rounded-2xl flex items-center justify-center">
                <CarFront size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("activeFinanceContract")}</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {activeFinance.year} {activeFinance.carMake} {activeFinance.carModel}
                </h1>
              </div>
            </div>
            <button onClick={() => setIsApplying(true)} className="bg-slate-50 border border-slate-200 hover:border-primary hover:text-primary text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
              <Plus size={18} /> {t("newRequest")}
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Wallet className="text-primary"/> {t("financialOverview")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Outstanding Balance */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto p-6 text-slate-100"><TrendingDown size={100} /></div>
              <div className="relative z-10">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">{t("outstandingBalance")}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-5xl font-black text-slate-900">{Number(activeFinance.outstandingBalance || 0).toLocaleString()}</p>
                  <img src={riyalIcon} alt="SAR" className="h-6 object-contain opacity-40" />
                </div>
                <p className="text-sm font-medium text-slate-400">{t("remainingAmountSettled")}</p>
              </div>
            </div>

            {/* Total Paid to Date */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto p-6 text-green-50"><CheckCircle size={100} /></div>
               <div className="relative z-10">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">{t("totalPaidToDate")}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-5xl font-black text-green-600">{Number(activeFinance.totalPaid || 0).toLocaleString()}</p>
                  <img src={riyalIcon} alt="SAR" className="h-6 object-contain opacity-60 filter sepia hue-rotate-90" />
                </div>
                <p className="text-sm font-medium text-slate-400">{t("includesDownPayment")}</p>
              </div>
            </div>
          </div>

          {/* Timeline Row */}
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock className="text-primary"/> {t("contractTimeline")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">{t("monthsPaid")}</p>
              <p className="text-4xl font-black text-slate-900">{activeFinance.monthsPaid || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">{t("remainingMonths")}</p>
              <p className="text-4xl font-black text-primary">{activeFinance.remainingMonths || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg text-white flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">{t("balloonPayment")}</p>
              <p className="text-xl font-bold">{t(activeFinance.lastPaymentMethod) || activeFinance.lastPaymentMethod || t("na")}</p>
            </div>
          </div>

          {/* Receipts Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CreditCard className="text-primary"/> {t("recentTransactions")}</h2>
            
            {(!activeFinance.receipts || activeFinance.receipts.length === 0) ? (
              <div className="text-center p-10 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
                {t("noTransactions")}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeFinance.receipts.map((receipt: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><CheckCircle size={24}/></div>
                      <div>
                        <p className="font-bold text-slate-900">{t("paymentProcessed")}</p>
                        <p className="text-xs text-slate-400">{receipt.date}</p>
                      </div>
                    </div>
                    <a href={receipt.fileData} download={receipt.fileName} className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                      <Download size={16} /> {t("receiptBtn")}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* THE APPLICATION FORM VIEW                   */}
      {/* ========================================= */}
      {isApplying && (
        <div className="animate-in fade-in duration-500">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t("applyForFinancing")}</h1>
              <p className="text-slate-500 mt-1">{t("uploadDocsSubtitle")}</p>
            </div>
            {activeFinance && (
              <button onClick={() => setIsApplying(false)} className="text-primary font-bold hover:underline">{t("cancelGoToDashboard")}</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. DOCUMENT UPLOADS */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-primary"/> {t("requiredDocuments")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'driversLicense', label: t("driversLicense"), isUploaded: userDocs.driversLicense },
                  { id: 'iqama', label: t("iqamaId"), isUploaded: userDocs.iqama },
                  { id: 'gosi', label: t("gosiCert"), isUploaded: userDocs.gosi },
                  { id: 'bankStatement', label: t("bankStatement3"), isUploaded: userDocs.bankStatement },
                ].map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="block text-sm font-bold text-slate-700 mb-2">{doc.label}</label>
                    {doc.isUploaded ? (
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-xl border border-green-100">
                        <CheckCircle size={20} /> {t("verifiedOnProfile")}
                      </div>
                    ) : previews[doc.id as keyof typeof previews] ? (
                      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary font-bold text-sm">
                        <span>{t("fileSelected")}</span>
                        <button type="button" onClick={() => setPreviews(p => ({...p, [doc.id]: ""}))} className="text-red-500 hover:text-red-700"><X size={18}/></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-white hover:border-primary transition-colors">
                        <UploadCloud className="text-slate-400 mb-1" size={20} />
                        <span className="text-xs font-medium text-slate-500">{t("clickToUpload")}</span>
                        <input type="file" required accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. VEHICLE & FINANCE DETAILS */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CarFront className="text-primary"/> {t("vehicleLoanDetails")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-sm font-bold text-slate-700 mb-1">{t("carMakeLabel")}</label><input type="text" required value={formData.carMake} onChange={e=>setFormData({...formData, carMake: e.target.value})} className={inputStyles} placeholder="Toyota" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">{t("carModelLabel")}</label><input type="text" required value={formData.carModel} onChange={e=>setFormData({...formData, carModel: e.target.value})} className={inputStyles} placeholder="Camry" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">{t("carYearLabel")}</label><input type="number" required value={formData.year} onChange={e=>setFormData({...formData, year: e.target.value})} className={inputStyles} placeholder="2024" /></div>
                
                {/* Form fields with Riyal symbol in label */}
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">{t("totalVehiclePrice")} <img src={riyalIcon} className="h-3 opacity-50" alt="SAR"/></label>
                  <input type="number" required value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className={inputStyles} placeholder="120000" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">{t("downPayment")} <img src={riyalIcon} className="h-3 opacity-50" alt="SAR"/></label>
                  <input type="number" required value={formData.downPayment} onChange={e=>setFormData({...formData, downPayment: e.target.value})} className={inputStyles} placeholder="20000" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t("lastPaymentMethod")}</label>
                  <select required value={formData.lastPaymentMethod} onChange={e=>setFormData({...formData, lastPaymentMethod: e.target.value})} className={inputStyles}>
                    <option value="" disabled>{t("selectOption")}</option>
                    <option value="balloonOpt1">{t("balloonOpt1")}</option>
                    <option value="balloonOpt2">{t("balloonOpt2")}</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50">
              {isSubmitting ? t("processingApp") : t("submitFinanceApp")}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}