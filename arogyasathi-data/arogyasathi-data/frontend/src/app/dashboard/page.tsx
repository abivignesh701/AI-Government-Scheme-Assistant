"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HeartHandshake, 
  LogOut, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  User as UserIcon,
  Globe2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Fetch profile data
      const fetchProfile = async () => {
        try {
          // Attempt to fetch from profiles table. Might be empty if trigger failed, 
          // but we have user.user_metadata as fallback
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!error && data) {
            setProfile(data);
          } else {
            setProfile({
              name: user.user_metadata?.name || 'User',
              email: user.email,
              preferred_language: user.user_metadata?.preferred_language || 'en'
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setDataLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, supabase]);

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-teal-200 rounded-xl mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-teal-200">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">ArogyaSathi</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                <UserIcon className="w-4 h-4" />
                {profile?.name}
              </div>
              <button 
                onClick={signOut}
                className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-slate-500 mt-1">Here is the status of your health scheme applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Profile Completeness</h3>
              <p className="text-sm text-slate-500 mt-1">Your basic eligibility profile is partially complete.</p>
              <Link href="/eligibility" className="text-sm font-medium text-blue-600 mt-3 inline-block hover:underline">
                Complete Profile →
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Applications</h3>
              <p className="text-sm text-slate-500 mt-1">You have 0 applications currently in progress.</p>
              <Link href="/schemes" className="text-sm font-medium text-amber-600 mt-3 inline-block hover:underline">
                Explore Schemes →
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Eligibility Matches</h3>
              <p className="text-sm text-slate-500 mt-1">Discover schemes you are definitively eligible for.</p>
              <Link href="/assistant" className="text-sm font-medium text-emerald-600 mt-3 inline-block hover:underline">
                Ask ArogyaSathi →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          </div>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Start by checking your eligibility or chatting with our AI assistant to find schemes that match your profile.
            </p>
            <Link href="/eligibility" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
              Check Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
