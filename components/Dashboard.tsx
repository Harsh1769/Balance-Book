import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CurrencyCode } from '../App';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp, Download } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, currency }) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatFullCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Calculate Totals
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Prepare Chart Data (Simulated monthly aggregation for demo + current cumulative)
  const data = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'May', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
    { name: 'Jul', income: 3490, expense: 4300 },
    { name: 'Aug', income: 7000, expense: 2400 },
    { name: 'Sep', income: 9000, expense: 3500 },
    { name: 'Oct', income: totalIncome > 10000 ? totalIncome : 12000, expense: totalExpense > 5000 ? totalExpense : 6000 }, 
  ];

  const handleDownloadReport = () => {
    // 1. Define CSV Headers
    const headers = ['Transaction ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
    
    // 2. Map Data to CSV Rows
    const rows = transactions.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.status
    ]);

    // 3. Combine Headers and Rows
    const csvContent = [
      headers.join(','), 
      ...rows.map(r => r.join(','))
    ].join('\n');

    // 4. Create Blob and Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time financial performance updates</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2"
        >
          <Download size={16} /> Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Income" 
          amount={formatFullCurrency(totalIncome)} 
          trend={12.5} 
          icon={<TrendingUp className="text-emerald-500" />} 
          color="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard 
          title="Total Expenses" 
          amount={formatFullCurrency(totalExpense)} 
          trend={-2.4} 
          icon={<Wallet className="text-rose-500" />} 
          color="text-rose-600 dark:text-rose-400"
        />
        <StatCard 
          title="Net Profit" 
          amount={formatFullCurrency(netProfit)} 
          trend={8.2} 
          icon={<DollarSign className="text-blue-500" />} 
          color={netProfit >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Revenue Flow</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                <Tooltip 
                  formatter={(value: number) => formatFullCurrency(value)}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Profitability Analysis</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', opacity: 0.1}} 
                  formatter={(value: number) => formatFullCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend />
                <Bar dataKey="income" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions Table Preview */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mt-6">
         <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent Transactions</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Date</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Description</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">Category</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-right">Amount</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 dark:text-slate-300">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 border-b border-slate-50 dark:border-slate-800">{t.date}</td>
                    <td className="py-3 border-b border-slate-50 dark:border-slate-800 font-medium">{t.description}</td>
                    <td className="py-3 border-b border-slate-50 dark:border-slate-800">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">{t.category}</span>
                    </td>
                    <td className={`py-3 border-b border-slate-50 dark:border-slate-800 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}{formatFullCurrency(t.amount)}
                    </td>
                    <td className="py-3 border-b border-slate-50 dark:border-slate-800 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, trend, icon, color }: { title: string, amount: string, trend: number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
      <div className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
        {trend >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {Math.abs(trend)}% from last month
      </div>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{amount}</p>
  </div>
);

export default Dashboard;