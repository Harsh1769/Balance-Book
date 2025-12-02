import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  Bell, 
  Search,
  CreditCard,
  BookOpen,
  Sparkles,
  Calculator,
  Globe,
  AlertTriangle,
  AlertCircle,
  Check,
  Loader2,
  Mail,
  Lock,
  User as UserIcon
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import AiAdvisor from './components/AiAdvisor';
import { Tools } from './components/Tools';
import { Transactions } from './components/Transactions';
import { Accounts } from './components/Accounts';
import { Inventory } from './components/Inventory';
import { LandingPage } from './components/LandingPage';
import { Settings } from './components/Settings';
import { MOCK_TRANSACTIONS, MOCK_INVOICES, MOCK_ACCOUNTS, MOCK_INVENTORY } from './constants';
import { Transaction, Invoice, BankAccount, Product } from './types';

// User Interface for State
export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  email: string;
}

const DEFAULT_USER: UserProfile = {
  name: "Harsh Sharma",
  role: "Owner",
  avatar: "", // Empty to trigger fallback
  email: "harsh.sharma@balancebook.com"
};

type ViewState = 'landing' | 'auth' | 'app';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
];

// Notification Type
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  read: boolean;
  timestamp: Date;
}

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  
  // Global Preferences with Persistence
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('bb_currency') as CurrencyCode) || 'INR';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('bb_theme') as 'light' | 'dark') || 'dark';
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bb_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('bb_user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setViewState('app');
    }
  }, []);

  // Data State with LocalStorage Persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bb_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bb_invoices');
    return saved ? JSON.parse(saved) : MOCK_INVOICES;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('bb_accounts');
    return saved ? JSON.parse(saved) : MOCK_ACCOUNTS;
  });

  const [inventory, setInventory] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bb_inventory');
    return saved ? JSON.parse(saved) : MOCK_INVENTORY;
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Effects for Persistence
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('bb_theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('bb_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('bb_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('bb_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('bb_accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('bb_inventory', JSON.stringify(inventory)); }, [inventory]);
  
  useEffect(() => {
    // Save user profile whenever it changes (e.g. avatar update)
    if (userProfile) {
        localStorage.setItem('bb_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Notification Logic
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    // Check Inventory Low Stock
    inventory.forEach(p => {
      if (p.stock <= p.lowStockThreshold) {
        newNotifications.push({
          id: `stock-${p.id}`,
          title: 'Low Stock Alert',
          message: `${p.name} is running low (${p.stock} remaining).`,
          type: 'warning',
          read: false,
          timestamp: new Date()
        });
      }
    });

    // Check Invoices Status and Due Dates
    invoices.forEach(inv => {
      // 1. Overdue Check
      if (inv.status === 'Overdue') {
        newNotifications.push({
          id: `inv-${inv.id}`,
          title: 'Overdue Invoice',
          message: `Invoice #${inv.invoiceNumber} for ${inv.customerName} is overdue.`,
          type: 'danger',
          read: false,
          timestamp: new Date(inv.dueDate)
        });
      }

      // 2. Upcoming Due Date Check (e.g. within 3 days)
      if (inv.status === 'Unpaid') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(inv.dueDate);
        due.setHours(0, 0, 0, 0);
        
        // Difference in milliseconds
        const diffTime = due.getTime() - today.getTime();
        // Difference in days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 3) {
           newNotifications.push({
            id: `inv-due-${inv.id}`,
            title: 'Payment Due Soon',
            message: `Invoice #${inv.invoiceNumber} is due ${diffDays === 0 ? 'today' : `in ${diffDays} days`}.`,
            type: 'warning',
            read: false,
            timestamp: new Date()
          });
        }
      }
    });

    setNotifications(newNotifications);
  }, [inventory, invoices]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Handlers
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const handleAddTransaction = (newTransaction: Transaction) => setTransactions(prev => [newTransaction, ...prev]);
  const handleDeleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));
  const handleAddInvoice = (newInvoice: Invoice) => setInvoices(prev => [newInvoice, ...prev]);
  const handleUpdateInvoice = (updatedInvoice: Invoice) => setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  const handleDeleteInvoice = (id: string) => {
    if(window.confirm("Are you sure you want to permanently delete this invoice?")) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const handleAddAccount = (newAccount: BankAccount) => setAccounts(prev => [...prev, newAccount]);
  const handleDeleteAccount = (id: string) => setAccounts(prev => prev.filter(a => a.id !== id));
  const handleAddProduct = (newProduct: Product) => setInventory(prev => [...prev, newProduct]);
  const handleUpdateStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(p => {
      if (p.id === id) return { ...p, stock: Math.max(0, p.stock + delta) };
      return p;
    }));
  };
  const handleDeleteProduct = (id: string) => setInventory(prev => prev.filter(p => p.id !== id));

  const handleResetData = () => {
    if(window.confirm("This will revert all transactions, invoices, accounts and inventory to their demo state. Are you sure?")) {
      setTransactions(MOCK_TRANSACTIONS);
      setInvoices(MOCK_INVOICES);
      setAccounts(MOCK_ACCOUNTS);
      setInventory(MOCK_INVENTORY);
      localStorage.removeItem('bb_transactions');
      localStorage.removeItem('bb_invoices');
      localStorage.removeItem('bb_accounts');
      localStorage.removeItem('bb_inventory');
      alert('Data has been reset.');
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    setTimeout(() => {
      let profile: UserProfile;
      
      if (authMode === 'register') {
        profile = {
          name: authForm.name || "Harsh Sharma",
          email: authForm.email,
          role: "Owner",
          avatar: "" // Empty to trigger auto-generation from name
        };
      } else {
        // Login Mode
        profile = {
          name: "Harsh Sharma",
          email: authForm.email || "harsh.sharma@balancebook.com",
          role: "Owner",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        };
      }

      setUserProfile(profile);
      localStorage.setItem('bb_user_profile', JSON.stringify(profile));
      setIsLoggingIn(false);
      setViewState('app');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate Google OAuth flow and data retrieval
    setTimeout(() => {
      const googleUser: UserProfile = {
        name: "Harsh Sharma",
        role: "Owner",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        email: "harsh.sharma@balancebook.com"
      };
      setUserProfile(googleUser);
      localStorage.setItem('bb_user_profile', JSON.stringify(googleUser));
      setIsLoggingIn(false);
      setViewState('app');
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('bb_user_profile');
    setViewState('landing');
    // We deliberately do NOT clear transactions/invoices to preserve "Activity done before"
    // This mimics a device-local database behavior.
  };

  // Landing Page View
  if (viewState === 'landing') {
    return <LandingPage onGetStarted={() => setViewState('auth')} />;
  }

  // Auth View
  if (viewState === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
         </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md z-10 animate-fade-in relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3">
               <BookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Balance Book</h1>
            <p className="text-blue-200 text-sm font-light mb-6">Enterprise Accounting Suite</p>
            
            <div className="inline-flex flex-col items-center bg-black/20 rounded-xl p-3 border border-white/5 w-full">
               <div className="text-[10px] uppercase tracking-[0.2em] text-blue-300 font-bold mb-1">Project By 11th Commerce</div>
               <div className="text-xs text-slate-300 font-medium">Founder: <span className="text-white font-semibold">Harsh Sharma</span></div>
            </div>
          </div>

          {/* Auth Toggle */}
          <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === 'register' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98] duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                 <Loader2 size={20} className="animate-spin text-slate-900" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/50 backdrop-blur-sm px-2 text-slate-400 rounded">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="relative">
                  <UserIcon size={18} className="absolute left-4 top-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="Password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 transition-colors shadow-lg transform active:scale-[0.98] duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
              >
                {isLoggingIn ? <Loader2 size={20} className="animate-spin" /> : (authMode === 'login' ? "Sign In to Dashboard" : "Create Account")}
              </button>
            </form>
          </div>
          <button onClick={() => setViewState('landing')} className="w-full text-center text-slate-400 text-xs mt-6 hover:text-white transition-colors">
            &larr; Back to Home
          </button>
        </div>
      </div>
    );
  }

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveView(id); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        activeView === id 
        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 dark:bg-blue-600 dark:shadow-none' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800">
          <div className="w-10 h-10 bg-slate-900 dark:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Balance Book</span>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Overview</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="advisor" icon={Sparkles} label="AI Advisor" />
          <NavItem id="tools" icon={Calculator} label="Calculators" />
          
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">Finance</p>
          <NavItem id="invoices" icon={FileText} label="Invoices" />
          <NavItem id="transactions" icon={CreditCard} label="Transactions" />
          <NavItem id="accounts" icon={Users} label="Accounts & Banking" />
          
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">Inventory</p>
          <NavItem id="inventory" icon={Package} label="Stock Management" />

          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-6">System</p>
          <NavItem id="settings" icon={SettingsIcon} label="Settings" />
        </div>

        <div className="p-4 border-t border-slate-50 dark:border-slate-800">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
           >
             <LogOut size={18} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-64 transition-colors">
              <Search size={16} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none text-sm focus:outline-none w-full placeholder-slate-400 text-slate-700 dark:text-slate-200" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <Globe size={16} />
                {currency}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 hidden group-hover:block animate-fade-in overflow-hidden">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      currency === c.code 
                        ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-in z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{notifications.length} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                        <Check size={24} className="mx-auto mb-2 opacity-50" />
                        All caught up!
                      </div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div key={idx} className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                           <div className="flex gap-3">
                              <div className={`mt-1 p-1.5 rounded-full h-fit ${
                                n.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 
                                n.type === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' : 
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {n.type === 'warning' ? <AlertTriangle size={14} /> : <AlertCircle size={14} />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                              </div>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold text-slate-900 dark:text-white">{userProfile.name}</p>
                 <p className="text-xs text-slate-500 dark:text-slate-400">{userProfile.role}</p>
               </div>
               <img 
                 src={userProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=0D8ABC&color=fff`} 
                 alt="User" 
                 className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover" 
               />
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 transition-colors">
          <div className="max-w-7xl mx-auto w-full">
            {activeView === 'dashboard' && <Dashboard transactions={transactions} currency={currency} />}
            
            {activeView === 'invoices' && (
              <Invoices 
                invoices={invoices} 
                onAddInvoice={handleAddInvoice} 
                onUpdateInvoice={handleUpdateInvoice}
                onDeleteInvoice={handleDeleteInvoice}
                currency={currency}
              />
            )}

            {activeView === 'transactions' && (
              <Transactions 
                transactions={transactions} 
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                currency={currency}
              />
            )}
            
            {activeView === 'accounts' && (
              <Accounts 
                accounts={accounts} 
                onAddAccount={handleAddAccount} 
                onDeleteAccount={handleDeleteAccount}
                currency={currency} 
              />
            )}

            {activeView === 'inventory' && (
              <Inventory 
                products={inventory} 
                onAddProduct={handleAddProduct}
                onUpdateStock={handleUpdateStock}
                onDeleteProduct={handleDeleteProduct}
                currency={currency}
              />
            )}
            
            {activeView === 'advisor' && (
              <AiAdvisor 
                transactions={transactions} 
                invoices={invoices} 
                accounts={accounts}
                currency={currency} 
              />
            )}
            
            {activeView === 'tools' && <Tools currency={currency} />}
            
            {activeView === 'settings' && (
              <Settings 
                theme={theme} 
                toggleTheme={toggleTheme} 
                currency={currency} 
                setCurrency={setCurrency}
                onResetData={handleResetData}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;