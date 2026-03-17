import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 transition-all duration-300">
      {/* 1. Left Side: Logo */}
      <div className="flex-1">
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tighter">
          HORIZONE
        </Link>
      </div>

      {/* 2. Middle: Search Bar */}
      <div className="flex-none gap-2 mr-4 hidden md:block">
        <div className="form-control">
          <input 
            type="text" 
            placeholder="Search destination..." 
            className="input input-bordered w-64 rounded-full bg-gray-50 h-10 text-sm" 
          />
        </div>
      </div>

      {/* 3. Right Side: User Profile & Buttons */}
      <div className="flex-none gap-4">
        <Link href="/signup" className="btn bg-white text-gray-900 border-gray-200 hover:bg-gray-50 rounded-full px-6 min-h-[40px] h-[40px]">
          Sign Up
        </Link>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}