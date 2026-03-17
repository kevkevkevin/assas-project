"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Banknote, Calculator, Clock, Percent, CarFront, Phone } from "lucide-react";

const CAR_DATA = {
  Toyota: ["Yaris", "Corolla", "Camry", "Urban Cruiser", "RAV4", "Fortuner", "Land Cruiser"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X7", "M4", "i4"],
  GAC: ["GS3", "GS4", "GS8", "Empow", "EMKOO"],
  MG: ["MG5", "MG6", "MG GT", "MG ZS", "MG RX5", "MG HS"],
  Mercedes: ["A-Class", "C-Class", "E-Class", "S-Class", "GLC", "GLE", "G-Class"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"],
  Kia: ["Cerato", "K5", "Sportage", "Sorento", "Telluride"]
};

export default function FinancePage() {
  const { user } = useAuth();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Added contactNumber state
  const [contactNumber, setContactNumber] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [carPrice, setCarPrice] = useState<number | "">("");
  const [downPayment, setDownPayment] = useState<number | "">("");
  const [months, setMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(4.5);

  const principal = (Number(carPrice) || 0) - (Number(downPayment) || 0);
  const monthlyInterest = (interestRate / 100) / 12;
  const numPayments = months;
  
  let estimatedMonthly = 0;
  if (principal > 0 && monthlyInterest > 0) {
    estimatedMonthly = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, numPayments)) / 
                       (Math.pow(1 + monthlyInterest, numPayments) - 1);
  } else if (principal > 0) {
    estimatedMonthly = principal / numPayments;
  }

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "finance"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedApps: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedApps.push({ id: doc.id, ...doc.data() });
      });
      fetchedApps.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setApplications(fetchedApps);
    } catch (error) {
      console.error("Error fetching finance apps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || principal <= 0) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "finance"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email, // <--- GRAB EMAIL!
        contactNumber,         // <--- GRAB NUMBER!
        carModel: `${selectedBrand} ${selectedModel}`,
        carPrice: Number(carPrice),
        downPayment: Number(downPayment),
        months,
        interestRate,
        estimatedMonthly: Math.round(estimatedMonthly),
        status: "Under Review",
        createdAt: new Date(),
      });

      setContactNumber("");
      setSelectedBrand("");
      setSelectedModel("");
      setCarPrice("");
      setDownPayment("");
      setMonths(60);
      
      fetchApplications(); 
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full input input-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:border-primary focus:outline-none px-4 border-slate-200";
  const selectStyles = "w-full select select-bordered bg-slate-50 text-slate-900 h-12 rounded-xl focus:border-primary focus:outline-none px-4 border-slate-200 font-normal";

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Car Financing</h1>
        <p className="text-slate-500 mt-1">Calculate your monthly payments and apply for auto financing instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Finance Application</h2>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-6">
            
            {/* CONTACT INFO */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Phone size={16} className="text-primary"/> Mobile Number (WhatsApp) *</label>
              <input 
                type="tel" required placeholder="e.g. +966 50 123 4567"
                value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}
                className={inputStyles} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Car Brand</label>
                <select required value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); }} className={selectStyles}>
                  <option value="" disabled>Select Brand</option>
                  {Object.keys(CAR_DATA).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Car Model</label>
                <select required value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className={`${selectStyles} disabled:bg-slate-100 disabled:text-slate-400`}>
                  <option value="" disabled>{selectedBrand ? "Select Model" : "Select Brand First"}</option>
                  {selectedBrand && CAR_DATA[selectedBrand as keyof typeof CAR_DATA].map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Car Price (ريال)</label>
                <input type="number" required placeholder="250000" min="10000" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value) || "")} className={inputStyles} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Down Payment (ريال)</label>
                <input type="number" required placeholder="50000" min="0" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value) || "")} className={inputStyles} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Term (Months)</label>
                <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className={selectStyles}>
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                  <option value={48}>48 Months</option>
                  <option value={60}>60 Months</option>
                  <option value={72}>72 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Est. Interest Rate</label>
                <div className="relative">
                  <input type="number" disabled value={interestRate} className={`${inputStyles} bg-slate-100 text-slate-500`} />
                  <Percent size={16} className="absolute right-4 top-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 mt-6 flex items-center justify-between shadow-lg shadow-slate-900/20">
              <div>
                <p className="text-slate-400 text-sm mb-1">Estimated Monthly Payment</p>
                <p className="text-3xl font-bold">
                  {estimatedMonthly > 0 ? Math.round(estimatedMonthly).toLocaleString() : "0"} <span className="text-sm font-normal text-slate-400">ريال / mo</span>
                </p>
              </div>
              <Banknote size={40} className="text-primary opacity-80" />
            </div>

            <button type="submit" disabled={isSubmitting || estimatedMonthly <= 0 || !selectedModel} className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Submitting Application..." : "Apply for Financing"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-primary" /> My Applications
          </h2>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px] text-slate-400 font-medium"><Clock className="animate-spin mr-2" size={20} /> Loading your applications...</div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4"><Banknote size={28} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No active applications</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Use the calculator on the left to estimate your payments and submit your first finance request.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {applications.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <CarFront size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{app.carModel}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                          <span>{app.months} months</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-slate-700">{app.estimatedMonthly.toLocaleString()} ريال / mo</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold border ${app.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-slate-400">Total: {app.carPrice.toLocaleString()} ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}