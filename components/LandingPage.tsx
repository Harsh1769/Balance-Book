import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Globe, Shield, Zap, BarChart3, PieChart, Play, X, Server, Users, Building2, Check, User } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white overflow-x-hidden relative scroll-smooth">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute w-full h-full object-cover opacity-40"
          poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://v4.cdnpk.net/videvo_files/video/free/2019-05/large_watermarked/190516_06_Money-Finance_12_preview.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
             <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               B
             </div>
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Balance Book</span>
           </div>
           <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
             <a href="#features" className="hover:text-white transition-colors">Features</a>
             <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
             <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
           </div>
           <div className="flex items-center gap-4">
             <button onClick={onGetStarted} className="hidden md:block text-sm font-medium text-white hover:text-blue-400 transition-colors">Log In</button>
             <button onClick={onGetStarted} className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-all shadow-lg shadow-white/10 transform hover:scale-105">
               Get Started
             </button>
           </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48 z-10">
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20 backdrop-blur-md">
                 <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                 AI-Powered Finance 2.0
               </div>
               <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                 Master your <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 animate-gradient-x">Global Capital</span>
               </h1>
               <p className="text-lg text-slate-300 max-w-xl leading-relaxed border-l-2 border-white/20 pl-6">
                 The complete operating system for modern finance teams. Automate bookkeeping, forecast with Gemini AI, and manage multi-currency inventory in real-time.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button onClick={onGetStarted} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transform hover:-translate-y-1 ring-4 ring-blue-600/20">
                   Start Free Trial <ArrowRight size={20} />
                 </button>
                 <button 
                   onClick={() => setShowDemo(true)}
                   className="px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                 >
                   <Play size={18} className="fill-current" /> Watch Demo
                 </button>
               </div>
               <div className="flex items-center gap-6 text-sm text-slate-400 pt-6">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> No credit card required</div>
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> 14-day free trial</div>
               </div>
            </div>
            
            <div className="relative animate-fade-in delay-100 hidden lg:block perspective-1000">
               {/* 3D Card Effect Container */}
               <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 shadow-2xl transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700 border border-white/10 group">
                  <div className="bg-slate-900/80 rounded-xl overflow-hidden border border-white/5">
                     {/* Mock Browser Header */}
                     <div className="h-12 bg-slate-800/50 border-b border-white/5 flex items-center gap-2 px-4 justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <div className="h-6 w-32 bg-white/5 rounded-md mx-auto"></div>
                     </div>
                     
                     {/* Dashboard Content Mockup */}
                     <div className="p-6 space-y-6">
                        <div className="flex justify-between items-end">
                           <div className="space-y-2">
                              <div className="h-2 w-24 bg-slate-700 rounded"></div>
                              <div className="h-8 w-48 bg-gradient-to-r from-white to-slate-400 rounded"></div>
                           </div>
                           <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <BarChart3 size={24} />
                           </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 h-40 items-end">
                           <div className="h-[40%] bg-slate-700/50 rounded-t-md w-full"></div>
                           <div className="h-[60%] bg-slate-700/50 rounded-t-md w-full"></div>
                           <div className="h-[30%] bg-slate-700/50 rounded-t-md w-full"></div>
                           <div className="h-[85%] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md shadow-[0_0_30px_rgba(59,130,246,0.5)] w-full relative group-hover:h-[95%] transition-all duration-500"></div>
                        </div>
                        <div className="flex gap-4">
                             <div className="flex-1 h-28 bg-slate-800/50 rounded-xl border border-white/5 p-4 shadow-inner flex flex-col justify-between">
                                <div className="flex justify-between">
                                   <div className="h-2 w-12 bg-slate-700 rounded"></div>
                                   <PieChart className="text-emerald-400 h-5 w-5" />
                                </div>
                                <div className="text-2xl font-bold text-white">$84.2k</div>
                             </div>
                             <div className="flex-1 h-28 bg-slate-800/50 rounded-xl border border-white/5 p-4 shadow-inner">
                                <div className="h-2 w-12 bg-slate-700 rounded mb-4"></div>
                                <div className="space-y-2">
                                   <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                      <div className="h-full w-3/4 bg-purple-500"></div>
                                   </div>
                                   <div className="h-1.5 w-2/3 bg-slate-700 rounded-full"></div>
                                </div>
                             </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Glowing aura */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 -z-10"></div>
               </div>
               
               {/* Floating Elements */}
               <div className="absolute -top-12 -right-12 p-4 bg-slate-800/80 backdrop-blur-md rounded-xl border border-white/10 shadow-xl animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <Zap size={20} className="fill-current" />
                    </div>
                    <div>
                       <div className="text-xs text-slate-400">Net Profit</div>
                       <div className="text-lg font-bold text-emerald-400">+24.5%</div>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      
      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900 relative border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">Everything needed to scale</h2>
              <p className="text-slate-400 text-lg">Premium tools designed for high-growth companies. Manage every cent with precision.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Globe className="text-blue-400" />} 
                title="Global Accounts" 
                desc="Multi-currency support with real-time exchange rates for international business expansion." 
              />
              <FeatureCard 
                icon={<Zap className="text-amber-400" />} 
                title="AI Automation" 
                desc="Smart categorization and predictive insights powered by advanced Gemini AI models." 
              />
              <FeatureCard 
                icon={<Shield className="text-emerald-400" />} 
                title="Bank-Grade Security" 
                desc="Enterprise-level encryption ensuring your financial data remains safe and private." 
              />
           </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Solutions for every stage</h2>
             <p className="text-slate-400">Tailored workflows whether you're a solo founder or a global enterprise.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
             <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl hover:bg-slate-900 transition-colors">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                   <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Freelancers & Startups</h3>
                <ul className="space-y-3 mb-8">
                   <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={16} className="text-purple-500" /> Automated Expense Tracking</li>
                   <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={16} className="text-purple-500" /> Professional Invoicing</li>
                   <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={16} className="text-purple-500" /> Tax Readiness Reports</li>
                </ul>
                <button onClick={onGetStarted} className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-2">
                   Get Started <ArrowRight size={16} />
                </button>
             </div>

             <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl hover:bg-slate-900 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                   <Building2 size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
                <ul className="space-y-3 mb-8">
                   <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={16} className="text-blue-500" /> Multi-Entity Management</li>
                   <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={16} className="text-blue-500" /> Advanced Role Permissions</li>
                   <li className="flex items-center gap-3 text-slate-400"><CheckCircle size={16} className="text-blue-500" /> Custom API Integration</li>
                </ul>
                <button onClick={onGetStarted} className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-2">
                   Contact Sales <ArrowRight size={16} />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 relative border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
               <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">Transparent Pricing</h2>
               <p className="text-slate-400 text-lg">Start small and scale up as you grow. No hidden fees.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {/* Starter Plan */}
               <div className="bg-slate-800/30 border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-all">
                  <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
                  <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                  <p className="text-slate-400 text-sm mb-8">Perfect for individuals and hobbyists.</p>
                  <button onClick={onGetStarted} className="w-full py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors mb-8">Start Free</button>
                  <ul className="space-y-4 text-sm text-slate-300">
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> Up to 50 Transactions</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> 1 Bank Account</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> Basic Reports</li>
                  </ul>
               </div>

               {/* Pro Plan */}
               <div className="bg-gradient-to-b from-blue-900/20 to-slate-800/30 border border-blue-500/30 p-8 rounded-2xl relative shadow-xl shadow-blue-900/10 transform md:-translate-y-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
                  <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                  <p className="text-slate-400 text-sm mb-8">For growing businesses and teams.</p>
                  <button onClick={onGetStarted} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors mb-8 shadow-lg shadow-blue-900/20">Get Started</button>
                  <ul className="space-y-4 text-sm text-slate-300">
                     <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> Unlimited Transactions</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> 5 Bank Accounts</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> AI Insights & Chat</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> Priority Support</li>
                  </ul>
               </div>

               {/* Enterprise Plan */}
               <div className="bg-slate-800/30 border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-all">
                  <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold text-white mb-6">Custom</div>
                  <p className="text-slate-400 text-sm mb-8">For large scale operations.</p>
                  <button onClick={onGetStarted} className="w-full py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors mb-8">Contact Sales</button>
                  <ul className="space-y-4 text-sm text-slate-300">
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> Unlimited Everything</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> Custom Integrations</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> Dedicated Account Manager</li>
                     <li className="flex items-center gap-3"><Check size={16} className="text-slate-500" /> SLA Guarantees</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-white/5 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around text-center divide-y md:divide-y-0 md:divide-x divide-white/5">
            <div className="p-8">
                <div className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">10k+</div>
                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Global Customers</div>
            </div>
             <div className="p-8">
                <div className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">$2B+</div>
                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Processed Volume</div>
            </div>
             <div className="p-8">
                <div className="text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">99.9%</div>
                <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Uptime SLA</div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
               <span className="text-white font-bold text-2xl tracking-tight">Balance Book</span>
               <p className="text-sm mt-2 max-w-xs text-slate-500">The operating system for your finance team.</p>
            </div>
            <div className="flex gap-8 text-sm font-medium">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left text-xs text-slate-600">
               © 2023 Balance Book. All rights reserved.
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-1">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Project By 11th Commerce</div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">Founder & Owner</span>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 font-serif">
                        Harsh Sharma
                    </span>
                </div>
            </div>
         </div>
      </footer>

      {/* Video Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <div className="aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/J03k5j0x-2A?autoplay=1&mute=0" 
                title="Balance Book Product Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-slate-800/40 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/5 group hover:bg-slate-800/60 hover:-translate-y-2">
     <div className="w-14 h-14 rounded-2xl bg-slate-700/50 flex items-center justify-center mb-6 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-300 border border-white/5">{icon}</div>
     <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
     <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);