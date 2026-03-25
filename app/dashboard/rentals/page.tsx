"use client";

import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { CarFront, Calendar, CheckCircle, Clock, Users, Search, SlidersHorizontal, X, AlertCircle, Upload, ShieldCheck } from "lucide-react";

const AVAILABLE_CARS = [
  { id: "c1", make: "Toyota", model: "Camry", year: "2024", color: "Pearl White", price: 65, image: "https://images.toyota-europe.com/hu/product-token/249c2709-1c4d-49c9-a758-babff8a95f6e/vehicle/467670d4-a811-40d6-bee0-5d56c108006d/width/1600/height/900/scale-mode/1/padding/12/background-colour/FFFFFF/image-quality/75/day-exterior-3_1F7_FA20.webp", type: "Sedan", seats: 5, fuel: "gasoline", transmission: "automatic" },
  { id: "c2", make: "BMW", model: "X5", year: "2023", color: "Midnight Black", price: 120, image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=800", type: "SUV", seats: 5, fuel: "gasoline", transmission: "automatic" },
  { id: "c3", make: "Tesla", model: "Model 3", year: "2024", color: "Midnight Silver", price: 95, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800", type: "Sedan", seats: 5, fuel: "electric", transmission: "automatic" },
  { id: "c4", make: "Ford", model: "F-150", year: "2023", color: "Oxford White", price: 85, image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800", type: "Truck", seats: 5, fuel: "gasoline", transmission: "automatic" },
  { id: "c5", make: "Mercedes-Benz", model: "C-Class", year: "2024", color: "Obsidian Black", price: 110, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800", type: "Sedan", seats: 5, fuel: "gasoline", transmission: "automatic" },
  { id: "c6", make: "Honda", model: "CR-V", year: "2024", color: "Sonic Gray", price: 75, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800", type: "SUV", seats: 5, fuel: "hybrid", transmission: "automatic" },
];

export default function CarRentalsPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [myRentals, setMyRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for Driver's License Verification
  const [hasLicense, setHasLicense] = useState(false);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);

  const [bookingForm, setBookingForm] = useState({
    contactNumber: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    notes: ""
  });

  // Check License AND Fetch Rentals
  useEffect(() => {
    const checkLicenseAndFetch = async () => {
      if (!user) return;
      
      // 1. Check for License in User Profile
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().driversLicense) {
          setHasLicense(true);
        }
      } catch (error) {
        console.error("Error checking license:", error);
      }

      // 2. Fetch Active Rentals
      setLoading(true);
      try {
        const q = query(collection(db, "rentals"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedRentals: any[] = [];
        querySnapshot.forEach((doc) => fetchedRentals.push({ id: doc.id, ...doc.data() }));
        fetchedRentals.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // Sort newest first
        setMyRentals(fetchedRentals);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLicenseAndFetch();
  }, [user]);

  // Handle image upload for the driver's license
  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLicensePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Calculate Days and Total Price dynamically
  let totalDays = 0;
  let totalPrice = 0;
  let invalidDates = false;

  if (bookingForm.startDate && bookingForm.endDate && selectedCar) {
    const start = new Date(bookingForm.startDate);
    const end = new Date(bookingForm.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      invalidDates = true; // End date is before start date!
    } else {
      // If they pick the same day for start and end, charge for 1 day minimum
      totalDays = diffDays === 0 ? 1 : diffDays;
      totalPrice = totalDays * selectedCar.price;
    }
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCar || invalidDates || totalDays <= 0) return;
    
    setIsSubmitting(true);
    try {
      // 1. Save license to their PROFILE if it's their first time
      if (!hasLicense && licensePreview) {
        await updateDoc(doc(db, "users", user.uid), {
          driversLicense: licensePreview
        });
        setHasLicense(true);
      }

      // 2. Save the booking
      await addDoc(collection(db, "rentals"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email, 
        contactNumber: bookingForm.contactNumber,
        make: selectedCar.make,
        model: selectedCar.model,
        year: selectedCar.year,
        dailyPrice: selectedCar.price,
        totalDays: totalDays,         
        totalPrice: totalPrice,       
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
        pickupLocation: bookingForm.pickupLocation,
        notes: bookingForm.notes,
        status: "Pending",            // Changed to Pending!
        createdAt: new Date(),
      });

      // Clear the form and switch to bookings tab
      setSelectedCar(null);
      setLicensePreview(null);
      setBookingForm({ contactNumber: "", startDate: "", endDate: "", pickupLocation: "", notes: "" });
      setActiveTab('bookings');
      
      // Refresh rentals
      const q = query(collection(db, "rentals"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedRentals: any[] = [];
      querySnapshot.forEach((doc) => fetchedRentals.push({ id: doc.id, ...doc.data() }));
      fetchedRentals.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setMyRentals(fetchedRentals);

    } catch (error) {
      console.error("Error booking car:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Car Rentals</h1>
        <p className="text-slate-500 mt-1">Browse available vehicles and manage your bookings</p>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full w-fit mb-8">
        <button onClick={() => setActiveTab('browse')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'browse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Browse Cars</button>
        <button onClick={() => setActiveTab('bookings')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>My Bookings</button>
      </div>

      {activeTab === 'browse' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input type="text" placeholder="Search by make or model..." className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary" />
            </div>
            <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={18} /> All Types
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_CARS.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <img src={car.image} alt={car.model} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="font-bold text-slate-900">{car.price}</span><span className="text-xs font-medium text-slate-500 ml-1">ريال/day</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg mb-0.5">{car.make} {car.model}</h3>
                  <p className="text-sm text-slate-500 mb-4">{car.year} · {car.color}</p>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                    <span className="flex items-center gap-1.5"><CarFront size={14} /> {car.transmission}</span>
                    <span className="flex items-center gap-1.5"><CarFront size={14} /> {car.fuel}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} /> {car.seats}</span>
                  </div>
                  <button onClick={() => setSelectedCar(car)} className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px] text-slate-400 font-medium"><Clock className="animate-spin mr-2" size={20} /> Loading bookings...</div>
            ) : myRentals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center px-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4"><Calendar size={28} /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No active bookings</h3>
                <p className="text-slate-500 max-w-sm mx-auto">You haven't rented any vehicles yet. Switch to the Browse tab to find your next ride!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myRentals.map((rental) => {
                  // Dynamic badge colors for rentals
                  const isApproved = rental.status === 'Approved' || rental.status === 'Active';
                  const isRejected = rental.status === 'Rejected';
                  const badgeClasses = isApproved ? "bg-green-50 text-green-600 border-green-100" 
                                     : isRejected ? "bg-red-50 text-red-600 border-red-100" 
                                     : "bg-orange-50 text-orange-600 border-orange-100";

                  return (
                    <div key={rental.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><CarFront size={24} /></div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{rental.make} {rental.model}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <span>{rental.startDate} to {rental.endDate}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-semibold text-slate-700">{rental.totalPrice ? `${rental.totalPrice.toLocaleString()} ريال total` : `${rental.dailyPrice} ريال / day`}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold border ${badgeClasses}`}>
                          {rental.status}
                        </span>
                        <span className="text-xs text-slate-400">Pickup: {rental.pickupLocation?.split('(')[0] || rental.pickupLocation}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedCar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedCar(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Book {selectedCar.make} {selectedCar.model}</h2>
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              
              {/* LICENSE VERIFICATION SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                {hasLicense ? (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <ShieldCheck size={20} /> Driver's License Verified
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Driver's License (First time only) *</label>
                    {licensePreview ? (
                      <div className="relative h-32 rounded-lg overflow-hidden border border-slate-300">
                        <img src={licensePreview} alt="License Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setLicensePreview(null)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 transition-colors text-white p-1 rounded-full"><X size={14}/></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-white hover:border-primary transition-colors group">
                        <Upload className="text-slate-400 mb-1 group-hover:text-primary transition-colors" />
                        <span className="text-xs text-slate-500 font-medium group-hover:text-primary transition-colors">Click to upload license</span>
                        <input type="file" accept="image/*" required className="hidden" onChange={handleLicenseUpload} />
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                <input 
                  type="tel" required placeholder="e.g. +966 50 123 4567"
                  value={bookingForm.contactNumber} 
                  onChange={(e) => setBookingForm({...bookingForm, contactNumber: e.target.value})}
                  className="w-full input input-bordered bg-white text-slate-900 h-11 rounded-xl focus:border-primary focus:outline-none px-3 border-slate-200" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input type="date" required value={bookingForm.startDate} onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})} className="w-full input input-bordered bg-white text-slate-900 h-11 rounded-xl focus:border-primary focus:outline-none px-3 border-slate-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input type="date" required value={bookingForm.endDate} onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})} className={`w-full input input-bordered bg-white text-slate-900 h-11 rounded-xl focus:border-primary focus:outline-none px-3 border-slate-200 ${invalidDates ? 'border-red-500' : ''}`} />
                </div>
              </div>

              {/* DYNAMIC TOTAL DISPLAY AREA */}
              {totalDays > 0 && !invalidDates && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 my-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Rental Summary</p>
                    <p className="text-sm font-medium text-slate-700">{totalDays} {totalDays === 1 ? 'Day' : 'Days'} × {selectedCar.price} ريال</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">Total Amount</p>
                    <p className="text-xl font-bold text-slate-900">{totalPrice.toLocaleString()} ريال</p>
                  </div>
                </div>
              )}

              {/* ERROR STATE FOR INVALID DATES */}
              {invalidDates && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> End date cannot be before start date.
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 mt-2">Pickup Location</label>
                <select required value={bookingForm.pickupLocation} onChange={(e) => setBookingForm({...bookingForm, pickupLocation: e.target.value})} className="w-full select select-bordered bg-white text-slate-900 h-11 rounded-xl focus:border-primary focus:outline-none px-3 border-slate-200 font-normal">
                  <option value="" disabled>Select pickup location</option>
                  <option value="Jeddah King Abdulaziz Airport (JED)">Jeddah King Abdulaziz Airport (JED)</option>
                  <option value="Jeddah Downtown Branch">Jeddah Downtown Branch</option>
                  <option value="Riyadh King Khalid Airport (RUH)">Riyadh King Khalid Airport (RUH)</option>
                  <option value="Dammam King Fahd Airport (DMM)">Dammam King Fahd Airport (DMM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Notes (optional)</label>
                <textarea value={bookingForm.notes} onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})} placeholder="Any special requests..." className="w-full textarea textarea-bordered bg-white text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary focus:outline-none p-3 min-h-[100px] border-slate-200" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedCar(null)} className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || invalidDates || totalDays <= 0 || (!hasLicense && !licensePreview)} className="flex-1 py-3 bg-primary hover:bg-secondary text-white rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}