"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function AuthNav() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="h-9 w-24 animate-pulse bg-slate-200 rounded-full"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm font-medium hover:text-teal-600 transition-colors">
          Dashboard
        </Link>
        <button 
          onClick={signOut}
          className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4 inline-block mr-1" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/login" className="text-sm font-medium hover:text-teal-600 transition-colors">
        Log In
      </Link>
      <Link href="/signup" className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
        Get Started
      </Link>
    </div>
  );
}
