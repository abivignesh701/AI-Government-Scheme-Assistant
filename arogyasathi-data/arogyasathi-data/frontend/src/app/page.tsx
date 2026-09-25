import Link from 'next/link';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Globe2, 
  ArrowRight,
  FileText,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import AuthNav from '@/components/ui/AuthNav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent tracking-tight">
                ArogyaSathi
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
              <Link href="/schemes" className="hover:text-teal-600 transition-colors">Find Schemes</Link>
              <Link href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</Link>
              <Link href="/assistant" className="hover:text-teal-600 transition-colors">Assistant</Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium">
                <Globe2 className="w-4 h-4" />
                <span>English</span>
              </button>
              <AuthNav />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 blur-[100px] rounded-full mix-blend-multiply" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Government Health Schemes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 leading-tight">
            Government health benefits, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              explained in your language.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Find and apply for health schemes that match your exact eligibility. We simplify official government rules so you can get the care you deserve.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/eligibility" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 text-white font-semibold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 hover:shadow-2xl hover:shadow-teal-600/30 hover:-translate-y-1 flex items-center justify-center gap-2 group">
              Check My Eligibility
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/assistant" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask ArogyaSathi
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">100%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Source-backed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">3</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Languages (En, Ta, Hi)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">AI</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Smart Matching</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600 mb-2">Safe</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">Privacy-conscious</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How ArogyaSathi Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Four simple steps to find and claim your health benefits.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Tell us about yourself', desc: 'Fill out a simple, guided profile questionnaire.' },
              { step: '2', title: 'Smart matching', desc: 'Our AI cross-references your profile with verified scheme rules.' },
              { step: '3', title: 'Understand benefits', desc: 'Get a clear explanation of exactly why you qualify.' },
              { step: '4', title: 'Apply with guidance', desc: 'Follow step-by-step instructions to apply officially.' }
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-teal-500" />
            <span className="text-xl font-bold text-white tracking-tight">ArogyaSathi</span>
          </div>
          <p className="text-sm text-center md:text-left">
            Government systems remain the final authority for enrollment and verification.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
