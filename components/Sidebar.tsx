"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CarFront, FileText, Banknote, ArrowRightLeft, ShieldCheck, LogOut, X, Wrench } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, role } = useAuth();

  // ADDED: Maintenance is now safely inside the menu array!
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Car Rentals", icon: <CarFront size={20} />, path: "/dashboard/rentals" },
    { name: "Lease Transfer", icon: <FileText size={20} />, path: "/dashboard/lease" },
    { name: "Financing", icon: <Banknote size={20} />, path: "/dashboard/finance" },
    { name: "Car Swap", icon: <ArrowRightLeft size={20} />, path: "/dashboard/swap" },
    { name: "Maintenance", icon: <Wrench size={20} />, path: "/dashboard/maintenance" },
  ];

  if (role === "admin") {
    menuItems.push({ name: "Admin Panel", icon: <ShieldCheck size={20} />, path: "/dashboard/admin" });
  }

  return (
    <aside className="w-64 h-screen bg-[#0f172a] text-white flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <CarFront size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">AutoSettle</h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase">Settlement Platform</p>
            </div>
          </div>
          
          {/* Mobile Close Button (Hidden on Desktop) */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-2 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose} // Closes the sidebar on mobile when you click a link!
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold uppercase shrink-0">
            {user?.displayName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.displayName || "User"}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{role || "user"}</p>
          </div>
          <button onClick={() => signOut(auth)} className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}