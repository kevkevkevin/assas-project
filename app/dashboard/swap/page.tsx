"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Plus, Clock, ArrowLeft, ArrowRightLeft, CarFront, Search, UploadCloud, X, Phone, ShieldCheck } from "lucide-react";

// NEW: AutoSettle Certified Inventory for Swapping!
const AUTOSETTLE_INVENTORY = [
  { id: "as1", make: "Porsche", model: "Macan", year: "2023", type: "SUV", value: "320,000 ريال", image: "https://images.unsplash.com/photo-1503376712344-652d0f4ca4f5?auto=format&fit=crop&q=80&w=800" },
  { id: "as2", make: "Mercedes-Benz", model: "G-Class", year: "2022", type: "SUV", value: "650,000 ريال", image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800" },
  { id: "as3", make: "Audi", model: "RS e-tron GT", year: "2024", type: "Sports", value: "540,000 ريال", image: "https://images.unsplash.com/photo-1614026480209-cd9934144671?auto=format&fit=crop&q=80&w=800" },
  { id: "as4", make: "BMW", model: "8 Series", year: "2023", type: "Coupe", value: "480,000 ريال", image: "https://images.unsplash.com/photo-1555008872-f03b347ffb53?auto=format&fit=crop&q=80&w=800" },
  { id: "as5", make: "Lexus", model: "LX 600", year: "2024", type: "SUV", value: "490,000 ريال", image: "https://images.unsplash.com/photo-1633511090164-b42e77e77a56?auto=format&fit=crop&q=80&w=800" },
  { id: "as6", make: "Range Rover", model: "Sport", year: "2023", type: "SUV", value: "520,000 ريال", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800" },
];

export default function CarSwapPage() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    contactNumber: "",
    myMake: "", myModel: "", myYear: "", myMileage: "",
    targetType: "", targetMake: "", notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fetchMySwaps = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "swaps"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedSwaps: any[] = [];
      querySnapshot.forEach((doc) => fetchedSwaps.push({ id: doc.id, ...doc.data() }));
      fetchedSwaps.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setSwaps(fetchedSwaps);
    } catch (error) {
      console.error("Error fetching swaps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySwaps();
  }, [user]);

  // NEW: Pre-fill the form when they click an AutoSettle car!
  const handleInitiateTrade = (car: any) => {
    setFormData({
      ...formData,
      targetMake: `${car.make} ${car.model}`,
      targetType: car.type,
      notes: `I am interested in trading my car for the AutoSettle Certified ${car.year} ${car.make} ${car.model}.`
    });
    setView('form');
  };

  const handleCreateSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "swaps"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email, 
        ...formData, 
        image: imagePreview,
        status: "Reviewing Matches",
        createdAt: new Date(),
      });

      setFormData({
        contactNumber: "",
        myMake: "", myModel: "", myYear: "", myMileage: "",
        targetType: "", targetMake: "", notes: ""
      });
      setImagePreview(null);
      setView('list');
      fetchMySwaps(); 
    } catch (error) {
      console.error("Error creating swap:", error);
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full input input-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:border-primary focus:outline-none px-4 border-slate-200";
  const selectStyles = "w-full select select-bordered bg-slate-50 text-slate-900 h-12 rounded-xl focus:border-primary focus:outline-none px-4 border-slate-200 font-normal";

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {view === 'list' && (
        <div className="animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Car Swap</h1>
              <p className="text-slate-500 mt-1">Trade your vehicle instantly with AutoSettle or the community.</p>
            </div>
            <button onClick={() => setView('form')} className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
              <Plus size={20} /> Propose Custom Swap
            </button>
          </div>

          {/* ========================================= */}
          {/* NEW: AUTOSETTLE CERTIFIED INVENTORY         */}
          {/* ========================================= */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-primary" size={24} /> AutoSettle Certified Swaps
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AUTOSETTLE_INVENTORY.map((car) => (
                <div key={car.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img src={car.image} alt={car.model} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-slate-100">
                      <ShieldCheck size={14} className="text-green-500" />
                      <span className="text-xs font-bold text-slate-900">Certified</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg mb-0.5">{car.make} {car.model}</h3>
                        <p className="text-sm font-medium text-slate-500">{car.year} • {car.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Est. Value</p>
                        <p className="font-bold text-primary">{car.value}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleInitiateTrade(car)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowRightLeft size={18} /> Trade for this
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================= */}
          {/* USER'S PERSONAL SWAP PROPOSALS            */}
          {/* ========================================= */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="text-slate-400" size={24} /> My Swap Proposals
            </h2>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-[300px] text-slate-400 font-medium">
                  <Clock className="animate-spin mr-2" size={20} /> Loading your swap listings...
                </div>
              ) : swaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center px-6">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                    <ArrowRightLeft size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No active swap requests</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Pick a car from the certified inventory above or propose a custom trade!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {swaps.map((swap) => (
                    <div key={swap.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                      <div className="flex items-center gap-4 flex-1">
                        {swap.image ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200">
                            <img src={swap.image} alt="My Car" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                            <CarFront size={28} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Offering</p>
                          <h3 className="font-bold text-slate-900 text-lg">{swap.myMake} {swap.myModel}</h3>
                          <p className="text-sm text-slate-500">{swap.myYear} • {swap.myMileage} km</p>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center justify-center text-slate-300 px-4">
                        <ArrowRightLeft size={24} />
                      </div>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Search size={28} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Looking For</p>
                          <h3 className="font-bold text-slate-900 text-lg">{swap.targetMake || "Any Brand"}</h3>
                          <p className="text-sm text-slate-500">{swap.targetType || "Any Body Type"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold border ${swap.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : swap.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                          {swap.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* THE DETAILED FORM VIEW                      */}
      {/* ========================================= */}
      {view === 'form' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button onClick={() => {setView('list'); setFormData({...formData, targetMake: "", targetType: "", notes: ""})}} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-6 transition-colors">
            <ArrowLeft size={20} /> Back to swaps
          </button>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Propose a Car Swap</h2>

            <form onSubmit={handleCreateSwap} className="space-y-10">
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                  <Phone className="text-primary" size={20} /> 1. Contact Information
                </h3>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                  <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleInputChange} placeholder="e.g. +966 50 123 4567" className={inputStyles} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                  <CarFront className="text-primary" size={20} /> 2. Vehicle You Are Offering
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Car Photo (Highly Recommended)</label>
                  {imagePreview ? (
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden group shadow-md border border-slate-200">
                      <img src={imagePreview} alt="Car Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => setImagePreview(null)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                          <X size={18} /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-56 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-orange-50 hover:border-primary hover:text-primary transition-colors cursor-pointer group">
                      <UploadCloud size={40} className="mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-base font-bold mb-1">Click to upload a photo of your car</span>
                      <span className="text-xs text-slate-400">JPG, PNG, WEBP accepted</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Make *</label>
                    <input type="text" name="myMake" required value={formData.myMake} onChange={handleInputChange} placeholder="e.g. Toyota" className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Model *</label>
                    <input type="text" name="myModel" required value={formData.myModel} onChange={handleInputChange} placeholder="e.g. Camry" className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Year *</label>
                    <input type="number" name="myYear" required value={formData.myYear} onChange={handleInputChange} placeholder="2022" className={inputStyles} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Current Mileage (km)</label>
                    <input type="number" name="myMileage" value={formData.myMileage} onChange={handleInputChange} placeholder="e.g. 45000" className={inputStyles} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                  <Search className="text-purple-600" size={20} /> 3. Vehicle You Are Looking For
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Body Type</label>
                    <select name="targetType" value={formData.targetType} onChange={handleInputChange} className={selectStyles}>
                      <option value="">Any Body Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Sports">Sports Car</option>
                      <option value="Truck">Truck / Pickup</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Brand & Model (Optional)</label>
                    <input type="text" name="targetMake" value={formData.targetMake} onChange={handleInputChange} placeholder="e.g. BMW, Mercedes, or Any" className={inputStyles} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Swap Terms & Notes</label>
                <textarea 
                  name="notes" value={formData.notes} onChange={handleInputChange} 
                  placeholder="E.g. Willing to pay up to 10,000 ريال cash difference..." 
                  className="w-full textarea textarea-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary focus:outline-none p-4 min-h-[120px] border-slate-200" 
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20">
                {isSubmitting ? "Submitting..." : "Submit Swap Proposal"}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}