import React, { useState, useRef } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { CurrencyCode } from '../App';
import { Plus, Search, Filter, ArrowDownRight, ArrowUpRight, Trash2, Calendar, Camera, Loader2, Upload } from 'lucide-react';
import { analyzeTransactionImage } from '../services/geminiService';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currency: CurrencyCode;
}

export const Transactions: React.FC<TransactionsProps> = ({ 
  transactions, 
  onAddTransaction, 
  onDeleteTransaction,
  currency 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.OTHER,
    date: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      status: 'Completed'
    };
    onAddTransaction(newTransaction);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
        description: '',
        amount: '',
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: new Date().toISOString().split('T')[0]
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanning(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        const mime = result.split(';')[0].split(':')[1];
        
        try {
            const data = await analyzeTransactionImage(base64, mime);
            if (data) {
                setFormData({
                    description: data.description || '',
                    amount: data.amount?.toString() || '',
                    type: data.type === 'Income' ? TransactionType.INCOME : TransactionType.EXPENSE,
                    category: data.category as TransactionCategory || TransactionCategory.OTHER,
                    date: data.date || new Date().toISOString().split('T')[0]
                });
                setShowForm(true);
            }
        } catch (error) {
            console.error("Scanning failed", error);
            alert("Failed to scan receipt. Please try again.");
        } finally {
            setIsScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    reader.readAsDataURL(file);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Record and monitor your financial activity</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
                {isScanning ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                Scan Receipt
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleScan}
            />

            <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2"
            >
            <Plus size={18} /> Add New
            </button>
        </div>
      </div>

      {/* Scanning Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl animate-fade-in border border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 animate-pulse"></div>
                    <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400 relative z-10" />
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Analyzing Receipt</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Extracting transaction details with AI...</p>
                </div>
            </div>
        </div>
      )}

      {/* Add Transaction Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl animate-slide-up overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record Transaction</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: TransactionType.EXPENSE})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Expense
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: TransactionType.INCOME})}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === TransactionType.INCOME ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                <input 
                  type="number" 
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input 
                  type="text" 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                  placeholder="e.g. Office Rent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as TransactionCategory})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                  >
                    {Object.values(TransactionCategory).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters & List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{t.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {t.type === TransactionType.INCOME ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">{t.category}</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center">
                      <Calendar size={48} className="mb-4 opacity-20" />
                      <p>No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};