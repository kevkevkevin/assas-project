"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Wrench, Plus, CarFront, Phone, MessageSquare, UploadCloud, X, Clock, CheckCircle } from "lucide-react";

export default function MaintenancePage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    carMake: "",
    carModel: "",
    year: "",
    contactNumber: "",
    message: ""
  });
  
  // Array to hold up to 3 base64 images
  const [images, setImages] = useState<string[]>([]);

  const fetchRequests = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "maintenance"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetched: any[] = [];
      querySnapshot.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
      fetched.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setRequests(fetched);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  // Handle Multiple Image Uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 3) {
      alert("You can only upload a maximum of 3 images.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "maintenance"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        ...formData,
        images: images,
        status: "Pending Review",
        createdAt: new Date(),
      });

      // TRIGGER AUTOMATED EMAIL
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: user.email,
            userName: user.displayName || "User",
            serviceType: "Car Maintenance/Service"
          })
        });
      } catch (emailError) {
        console.error("Failed to send notification email", emailError);
      }

      setFormData({ carMake: "", carModel: "", year: "", contactNumber: "", message: "" });
      setImages([]);
      setView('list');
      fetchRequests();

    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles = "w-full input input-bordered bg-slate-50 text-slate-900 h-12 rounded-xl focus:border-primary focus:outline-none px-4 border-slate-200";

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {view === 'list' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 text-primary flex items-center justify-center rounded-2xl shadow-lg shadow-slate-900/20">
                  <Wrench size={24} />
                </div>
                Maintenance & Service
              </h1>
              <p className="text-slate-500 mt-2">Book a repair, inspection, or routine service for your vehicle.</p>
            </div>
            <button onClick={() => setView('form')} className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2">
              <Plus size={20} /> Request Service
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px] text-slate-400 font-medium">
                <Clock className="animate-spin mr-2" size={20} /> Loading requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Wrench size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Service Requests</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Keep your car in top shape. Click the button above to schedule your first maintenance appointment.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
                        {req.images && req.images.length > 0 ? (
                           <img src={req.images[0]} className="w-full h-full object-cover rounded-2xl" alt="Issue thumbnail" />
                        ) : (
                           <Wrench size={28} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{req.carMake} {req.carModel} <span className="text-slate-400 font-normal">({req.year})</span></h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1 max-w-md">{req.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${req.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : req.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {req.createdAt?.seconds ? new Date(req.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
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
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Request Maintenance</h1>
              <p className="text-slate-500 mt-1">Provide details and photos so our team can assess the issue.</p>
            </div>
            <button onClick={() => setView('list')} className="text-primary font-bold hover:underline">Cancel Request</button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
            
            {/* 1. Vehicle Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                <CarFront className="text-primary" size={20} /> 1. Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Make *</label>
                  <input type="text" required value={formData.carMake} onChange={e => setFormData({...formData, carMake: e.target.value})} placeholder="e.g. Toyota" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Model *</label>
                  <input type="text" required value={formData.carModel} onChange={e => setFormData({...formData, carModel: e.target.value})} placeholder="e.g. Camry" className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Year *</label>
                  <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="e.g. 2021" className={inputStyles} />
                </div>
              </div>
            </div>

            {/* 2. Contact Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                <Phone className="text-primary" size={20} /> 2. Contact Number
              </h3>
              <div className="max-w-md">
                <label className="block text-sm font-bold text-slate-700 mb-1">WhatsApp Number *</label>
                <input type="tel" required value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} placeholder="+966 50 123 4567" className={inputStyles} />
                <p className="text-xs text-slate-400 mt-2">Our service team will contact you here to schedule the appointment.</p>
              </div>
            </div>

            {/* 3. Issue Description & Photos */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-6 flex items-center gap-2">
                <MessageSquare className="text-primary" size={20} /> 3. Issue Details & Photos
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-1">Describe the problem or service needed *</label>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="E.g., I need a 10,000km routine service, or there is a scratch on the left door..." className="w-full textarea textarea-bordered bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary focus:outline-none p-4 min-h-[120px] border-slate-200" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  Upload Photos (Optional) 
                  <span className="text-slate-400 font-normal">{images.length}/3 uploaded</span>
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 group shadow-sm">
                      <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeImage(index)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {images.length < 3 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl cursor-pointer hover:bg-orange-50 hover:border-primary hover:text-primary text-slate-400 transition-colors">
                      <UploadCloud size={24} className="mb-2" />
                      <span className="text-xs font-bold">Add Photo</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50">
              {isSubmitting ? "Submitting Request..." : "Submit Maintenance Request"}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}