import React, { useState } from 'react';
import { Product } from '../types';
import { CurrencyCode } from '../App';
import { Plus, Search, AlertTriangle, Package, TrendingUp, Minus } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateStock: (id: string, delta: number) => void;
  onDeleteProduct: (id: string) => void;
  currency: CurrencyCode;
}

export const Inventory: React.FC<InventoryProps> = ({ 
  products, 
  onAddProduct, 
  onUpdateStock,
  onDeleteProduct,
  currency 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    stock: '',
    price: '',
    lowStockThreshold: '10'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      sku: newProduct.sku,
      stock: parseInt(newProduct.stock),
      price: parseFloat(newProduct.price),
      lowStockThreshold: parseInt(newProduct.lowStockThreshold)
    };
    onAddProduct(product);
    setShowForm(false);
    setNewProduct({ name: '', sku: '', stock: '', price: '', lowStockThreshold: '10' });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Stock Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track inventory levels and product catalog</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl animate-slide-up overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Product</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                    <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                    <input required type="text" value={newProduct.sku} onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                    <input required type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Initial Stock</label>
                    <input required type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alert Limit</label>
                    <input required type="number" value={newProduct.lowStockThreshold} onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
                 </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all mt-2">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
         <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4 items-center bg-slate-50/50 dark:bg-slate-800/30">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search SKU or Product..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Info</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Price</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Stock Level</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredProducts.map((p) => (
                   <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500">
                               <Package size={16} />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">{p.name}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{p.sku}</td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-slate-900 dark:text-white">{formatCurrency(p.price)}</td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col items-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${
                               p.stock <= p.lowStockThreshold 
                               ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                               : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            }`}>
                               {p.stock} Units
                            </span>
                            {p.stock <= p.lowStockThreshold && (
                               <span className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                                  <AlertTriangle size={10} /> Low Stock
                               </span>
                            )}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                            <button onClick={() => onUpdateStock(p.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors">
                               <Minus size={14} />
                            </button>
                            <button onClick={() => onUpdateStock(p.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors">
                               <Plus size={14} />
                            </button>
                         </div>
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