// components/Navbar.js
import Link from "next/link";
import { FaSearch, FaUser } from "react-icons/fa";

export default function CommonNavbar() {
  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-semibold flex items-center space-x-2 hover:scale-105 transition-transform">
            <span className="text-sky-500 font-bold">Vineeth</span>
            <span className="text-emerald-400 font-bold">News</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-base font-medium">
          <Link href="/" className="text-slate-300 hover:text-sky-400 transition-colors relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
          </Link>

          <Link href="/about" className="text-slate-300 hover:text-sky-400 transition-colors relative group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
          </Link>

          <Link href="/contact" className="text-slate-300 hover:text-sky-400 transition-colors relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="md:hidden flex items-center space-x-6">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-sky-400 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
