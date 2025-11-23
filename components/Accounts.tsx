import React, { useState } from 'react';
import { BankAccount } from '../types';
import { CurrencyCode } from '../App';
import { Plus, Trash2, Building, ExternalLink, Calculator, ArrowRightLeft, X } from 'lucide-react';
import { EXCHANGE_RATES } from '../constants';

interface AccountsProps {
  accounts: BankAccount[];
  onAddAccount: (account: BankAccount) => void;
  onDeleteAccount: (id: string) => void;
  currency: CurrencyCode;
}

export const Accounts: React.FC<AccountsProps> = ({ 
  accounts, 
  onAddAccount, 
  onDeleteAccount,
  currency: globalCurrency
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  
  // New Account Form State
  const [newAccount, setNewAccount] = useState<{
    bankName: string;
    accountNumber: string;
    balance: string;
    currency: CurrencyCode;
  }>({
    bankName: '',
    accountNumber: '',
    balance: '',
    currency: globalCurrency
  });

  // Calculator State
  const [calcAmount, setCalcAmount] = useState<string>('1000');
  const [calcFrom, setCalcFrom] = useState<CurrencyCode>('USD');
  const [calcTo, setCalcTo] = useState<CurrencyCode>(globalCurrency);

  const formatCurrency = (amount: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account: BankAccount = {
      id: Date.now().toString(),
      bankName: newAccount.bankName,
      accountNumber: newAccount.accountNumber,
      balance: parseFloat(newAccount.balance) || 0,
      currency: newAccount.currency
    };
    onAddAccount(account);
    setShowForm(false);
    setNewAccount({ bankName: '', accountNumber: '', balance: '', currency: globalCurrency });
  };

  // Calculate Total Liquidity accurately using Exchange Rates
  const totalLiquidity = accounts.reduce((acc, curr) => {
     const rateToUSD = 1 / (EXCHANGE_RATES[curr.currency] || 1); 
     const amountInUSD = curr.balance * rateToUSD;
     const rateToGlobal = EXCHANGE_RATES[globalCurrency] || 1;
     return acc + (amountInUSD * rateToGlobal);
  }, 0);

  // Calculator Logic
  const convertedAmount = (() => {
    const amt = parseFloat(calcAmount) || 0;
    const rateToUSD = 1 / (EXCHANGE_RATES[calcFrom] || 1);
    const usdAmount = amt * rateToUSD;
    const rateToTarget = EXCHANGE_RATES[calcTo] || 1;
    return usdAmount * rateToTarget;
  })();

  return (
    <div className="p-6 animate-fade-in pb-24 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bank Accounts</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage liquidity and treasury</p>
        </div>
        <div className="flex gap-3">
            <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 border ${
                showCalculator 
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            >
            <Calculator size={18} /> Currency Tool
            </button>
            <button 
            onClick={() => setShowForm(true)}
            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2"
            >
            <Plus size={18} /> Add Account
            </button>
        </div>
      </div>

      {/* Calculator Widget */}
      {showCalculator && (
          <div className="absolute right-6 top-24 z-20 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><ArrowRightLeft size={16} className="text-blue-500"/> Converter</h3>
                  <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
              </div>
              <div className="p-5 space-y-4">
                  <div>
                      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Amount</label>
                      <input 
                        type="number" 
                        value={calcAmount} 
                        onChange={(e) => setCalcAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                      <div>
                           <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">From</label>
                           <select 
                             value={calcFrom} 
                             onChange={(e) => setCalcFrom(e.target.value as CurrencyCode)}
                             className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none"
                           >
                                {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                      </div>
                      <div className="pb-2 text-slate-400"><ArrowRightLeft size={14} /></div>
                      <div>
                           <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">To</label>
                           <select 
                             value={calcTo} 
                             onChange={(e) => setCalcTo(e.target.value as CurrencyCode)}
                             className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none"
                           >
                                {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                      </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Result</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(convertedAmount, calcTo)}</p>
                      <p className="text-[10px] text-slate-400 mt-1">1 {calcFrom} = {((EXCHANGE_RATES[calcTo]||1) / (EXCHANGE_RATES[calcFrom]||1)).toFixed(4)} {calcTo}</p>
                  </div>
              </div>
          </div>
      )}

      {/* Liquidity Overview */}
      <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-blue-900 dark:to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <div className="relative z-10">
           <p className="text-slate-300 text-sm font-medium mb-1">Total Liquidity ({globalCurrency})</p>
           <h1 className="text-4xl font-bold tracking-tight">{formatCurrency(totalLiquidity, globalCurrency)}</h1>
           <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time consolidated value across {accounts.length} accounts
           </p>
         </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl animate-slide-up overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Link Bank Account</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                <input 
                  required
                  type="text" 
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="e.g. Chase Business"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number (Last 4)</label>
                <input 
                  required
                  type="text" 
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="**** 1234"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Balance</label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    step="0.01"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                  <select 
                    value={newAccount.currency}
                    onChange={(e) => setNewAccount({...newAccount, currency: e.target.value as CurrencyCode})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all mt-2">
                Save Account
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative group hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
               <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                 <Building size={24} />
               </div>
               <div className="flex gap-2">
                 <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ExternalLink size={18} />
                 </button>
                 <button 
                    onClick={() => onDeleteAccount(acc.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                 </button>
               </div>
            </div>
            
            <div className="space-y-1 mb-6">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">{acc.bankName}</h3>
               <p className="text-slate-500 dark:text-slate-400 font-mono text-sm tracking-wider">{acc.accountNumber}</p>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
               <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Balance</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(acc.balance, acc.currency)}</p>
               </div>
               <div className="text-right">
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-md">Active</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};