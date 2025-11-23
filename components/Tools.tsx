import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, Percent, Calendar } from 'lucide-react';
import { CurrencyCode } from '../App';

interface ToolsProps {
  currency: CurrencyCode;
}

export const Tools: React.FC<ToolsProps> = ({ currency }) => {
  const [activeTab, setActiveTab] = useState<'emi' | 'gst'>('emi');

  return (
    <div className="p-6 animate-fade-in pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Tools</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Professional calculators for quick financial estimations</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden max-w-4xl">
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('emi')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'emi' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            EMI Calculator
            {activeTab === 'emi' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('gst')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'gst' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            GST Calculator
            {activeTab === 'gst' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>}
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'emi' ? <EmiCalculator currency={currency} /> : <GstCalculator currency={currency} />}
        </div>
      </div>
    </div>
  );
};

const EmiCalculator = ({ currency }: { currency: CurrencyCode }) => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateEMI = () => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (r === 0) return amount / n;
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const emi = calculateEMI();
  const totalPayment = emi * years * 12;
  const totalInterest = totalPayment - amount;

  const data = [
    { name: 'Principal', value: amount },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = ['#0ea5e9', '#f43f5e'];

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Loan Amount</label>
             <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{formatCurrency(amount)}</span>
          </div>
          <div className="relative mb-3">
            <div className="absolute left-3 top-3 text-slate-400 text-sm font-bold">{currency === 'USD' ? '$' : currency}</div>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-shadow shadow-sm" />
          </div>
          <input type="range" min="1000" max="1000000" step="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate (%)</label>
             <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{rate}%</span>
          </div>
          <div className="relative mb-3">
            <Percent size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-shadow shadow-sm" />
          </div>
          <input type="range" min="1" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Loan Tenure (Years)</label>
             <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{years} Yr</span>
          </div>
          <div className="relative mb-3">
            <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-shadow shadow-sm" />
          </div>
          <input type="range" min="1" max="30" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="h-48 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-6 space-y-1 relative z-10">
           <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Monthly Payment</p>
           <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrency(emi)}</p>
           <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div> Principal
              </div>
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 rounded-full bg-[#f43f5e]"></div> Interest
              </div>
           </div>
           <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 w-full">Total Interest Payable: <span className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(totalInterest)}</span></p>
        </div>
      </div>
    </div>
  );
};

const GstCalculator = ({ currency }: { currency: CurrencyCode }) => {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [type, setType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(val);
  };

  const calculateGST = () => {
    if (type === 'exclusive') {
       const gst = (amount * gstRate) / 100;
       return { gst, total: amount + gst, net: amount };
    } else {
       const gst = amount - (amount * (100 / (100 + gstRate)));
       return { gst, total: amount, net: amount - gst };
    }
  };

  const result = calculateGST();

  return (
     <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit mx-auto">
           <button onClick={() => setType('exclusive')} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${type === 'exclusive' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>GST Exclusive</button>
           <button onClick={() => setType('inclusive')} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${type === 'inclusive' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>GST Inclusive</button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount</label>
            <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400 text-sm font-bold">{currency === 'USD' ? '$' : currency}</div>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all" />
            </div>
           </div>
           <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GST Rate (%)</label>
             <div className="relative">
                 <Percent size={16} className="absolute left-3 top-3 text-slate-400" />
                 <select value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all appearance-none">
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                 </select>
             </div>
           </div>
        </div>

        <div className="bg-slate-900 dark:bg-blue-900/40 text-white p-8 rounded-2xl space-y-4 mt-8 shadow-xl shadow-slate-200 dark:shadow-none border border-transparent dark:border-blue-800">
           <div className="flex justify-between items-center pb-4 border-b border-slate-700 dark:border-blue-800">
              <span className="text-slate-400 dark:text-blue-200">Net Amount</span>
              <span className="font-medium text-xl">{formatCurrency(result.net)}</span>
           </div>
           <div className="flex justify-between items-center pb-4 border-b border-slate-700 dark:border-blue-800">
              <span className="text-slate-400 dark:text-blue-200">GST Amount ({gstRate}%)</span>
              <span className="font-medium text-xl text-emerald-400">+{formatCurrency(result.gst)}</span>
           </div>
           <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-white">Total Amount</span>
              <span className="text-3xl font-bold tracking-tight">{formatCurrency(result.total)}</span>
           </div>
        </div>
     </div>
  );
}