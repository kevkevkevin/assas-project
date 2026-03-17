"use client";

import { useAuth } from "../../context/AuthContext";
import { CarFront, FileText, Banknote, ArrowRightLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for ALL our numbers!
  const [leaseCount, setLeaseCount] = useState(0);
  const [rentalCount, setRentalCount] = useState(0);
  const [financeCount, setFinanceCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);
  
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Protect the route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch real data from ALL Firebase collections
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const allRequests: any[] = [];

        // 1. Fetch Lease Transfers
        const leaseQuery = query(collection(db, "leases"), where("userId", "==", user.uid));
        const leaseSnapshot = await getDocs(leaseQuery);
        setLeaseCount(leaseSnapshot.size);
        leaseSnapshot.forEach((doc) => {
          allRequests.push({ 
            id: doc.id, 
            requestType: "Lease Transfer", 
            icon: <FileText size={24} />, 
            title: `${doc.data().make} ${doc.data().model} (${doc.data().year})`,
            displayAmount: `${doc.data().monthlyPayment} ريال`,
            ...doc.data() 
          });
        });
        
        // 2. Fetch Car Rentals
        const rentalQuery = query(collection(db, "rentals"), where("userId", "==", user.uid));
        const rentalSnapshot = await getDocs(rentalQuery);
        setRentalCount(rentalSnapshot.size);
        rentalSnapshot.forEach((doc) => {
          allRequests.push({ 
            id: doc.id, 
            requestType: "Car Rental", 
            icon: <CarFront size={24} />, 
            title: `${doc.data().make} ${doc.data().model} (${doc.data().year})`,
            displayAmount: `${doc.data().dailyPrice} ريال`,
            ...doc.data() 
          });
        });

        // 3. Fetch Financing
        const financeQuery = query(collection(db, "finance"), where("userId", "==", user.uid));
        const financeSnapshot = await getDocs(financeQuery);
        setFinanceCount(financeSnapshot.size);
        financeSnapshot.forEach((doc) => {
          allRequests.push({ 
            id: doc.id, 
            requestType: "Financing", 
            icon: <Banknote size={24} />, 
            title: doc.data().carModel, // Finance saves it as one string
            displayAmount: `${doc.data().estimatedMonthly?.toLocaleString()} ريال/mo`,
            ...doc.data() 
          });
        });

        // 4. Fetch Swaps
        const swapQuery = query(collection(db, "swaps"), where("userId", "==", user.uid));
        const swapSnapshot = await getDocs(swapQuery);
        setSwapCount(swapSnapshot.size);
        swapSnapshot.forEach((doc) => {
          allRequests.push({ 
            id: doc.id, 
            requestType: "Car Swap", 
            icon: <ArrowRightLeft size={24} />, 
            title: `${doc.data().myMake} ${doc.data().myModel} (${doc.data().myYear})`,
            displayAmount: "Trade",
            ...doc.data() 
          });
        });

        // Sort them by date so the newest is ALWAYS at the top!
        allRequests.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        
        setRecentRequests(allRequests);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (authLoading || dataLoading) return <div className="p-10 text-primary font-bold">Loading your dashboard...</div>;
  if (!user) return null;

  const firstName = user.displayName ? user.displayName.split(" ")[0] : "User";
  const totalRequests = leaseCount + rentalCount + financeCount + swapCount;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* Top Right Welcome */}
      <div className="flex justify-end mb-6 text-sm text-slate-500">
        Welcome, <span className="font-bold text-slate-900 ml-1">{user.displayName || "User"}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {firstName}
        </h1>
        <p className="text-slate-500 mt-1">Here's an overview of your automotive services</p>
      </div>

      {/* ROW 1: Numbers Stats Grid (NOW 100% DYNAMIC FOR ALL 4 SERVICES!) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatNumberCard title="Active Rentals" value={rentalCount.toString()} icon={<CarFront size={20} />} color="text-blue-600 bg-blue-50" />
        <StatNumberCard title="Lease Transfers" value={leaseCount.toString()} icon={<FileText size={20} />} color="text-orange-600 bg-orange-50" />
        <StatNumberCard title="Finance Apps" value={financeCount.toString()} icon={<Banknote size={20} />} color="text-green-600 bg-green-50" />
        <StatNumberCard title="Swap Requests" value={swapCount.toString()} icon={<ArrowRightLeft size={20} />} color="text-purple-600 bg-purple-50" />
      </div>

      {/* ROW 2: Action/Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatInfoCard title="Rent a Car" desc="Browse & book vehicles" icon={<CarFront size={20} />} color="text-blue-600 bg-blue-50" onClick={() => router.push('/dashboard/rentals')} />
        <StatInfoCard title="Lease Transfer" desc="Transfer or list your lease" icon={<FileText size={20} />} color="text-orange-600 bg-orange-50" onClick={() => router.push('/dashboard/lease')} />
        <StatInfoCard title="Get Financing" desc="Apply for car financing" icon={<Banknote size={20} />} color="text-green-600 bg-green-50" onClick={() => router.push('/dashboard/finance')} />
        <StatInfoCard title="Swap Your Car" desc="Trade your vehicle" icon={<ArrowRightLeft size={20} />} color="text-purple-600 bg-purple-50" onClick={() => router.push('/dashboard/swap')} />
      </div>

      {/* ROW 3: My Requests List (Now Combines ALL 4 Services!) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-lg font-bold text-slate-900">My Requests</h2>
          <p className="text-sm text-slate-500 mb-6">Track all your automotive service requests</p>
          
          <div className="flex gap-4 border-b border-slate-100 pb-2">
            <button className="text-sm font-bold text-slate-900 border-b-2 border-primary pb-2 flex items-center gap-2">
              Active <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">{totalRequests}</span>
            </button>
            <button className="text-sm font-medium text-slate-500 pb-2 flex items-center gap-2 hover:text-slate-900 transition-colors">
              Past <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">0</span>
            </button>
            <button className="text-sm font-medium text-slate-500 pb-2 flex items-center gap-2 hover:text-slate-900 transition-colors">
              All <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-xs">{totalRequests}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          
          {recentRequests.length === 0 ? (
             <div className="p-8 text-center text-slate-400 text-sm">
                You don't have any active requests yet.
             </div>
          ) : (
            recentRequests.map((request) => {
              // Decide badge color based on the status
              const isApproved = request.status === 'Approved' || request.status === 'Active';
              const isRejected = request.status === 'Rejected';
              const isReviewing = request.status === 'Reviewing Matches'; // Swap custom status
              
              const badgeClasses = isApproved 
                ? "bg-green-50 text-green-600 border-green-100" 
                : isRejected 
                ? "bg-red-50 text-red-600 border-red-100"
                : isReviewing
                ? "bg-purple-50 text-purple-600 border-purple-100"
                : "bg-orange-50 text-orange-600 border-orange-100"; // Pending / Under Review

              return (
                <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-primary flex items-center justify-center border border-slate-100 shrink-0">
                      {request.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{request.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{request.requestType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-slate-900 hidden sm:block">{request.displayAmount}</span>
                    <span className={`px-3 py-1 rounded-md text-xs font-bold border ${badgeClasses}`}>
                      {request.status}
                    </span>
                    <span className="text-xs text-slate-400 w-24 text-right hidden lg:block">
                      {request.createdAt?.toDate ? request.createdAt.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Just now'}
                    </span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>

    </div>
  );
}

// Helper Components
function StatNumberCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function StatInfoCard({ title, desc, icon, color, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full cursor-pointer group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-900 font-bold text-sm mb-1">{title}</h3>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </div>
  );
}