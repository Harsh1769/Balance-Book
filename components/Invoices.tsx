import React, { useState } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { CurrencyCode } from '../App';
import { FileText, Plus, Download, Mail, MoreVertical, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface InvoicesProps {
  invoices: Invoice[];
  onAddInvoice: (inv: Invoice) => void;
  onUpdateInvoice: (inv: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  currency: CurrencyCode;
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, onAddInvoice, onUpdateInvoice, onDeleteInvoice, currency }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<{desc: string, price: number, qty: number}[]>([
    { desc: 'Service Charge', price: 0, qty: 1 }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const addItem = () => {
    setItems([...items, { desc: '', price: 0, qty: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      customerName,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Unpaid',
      totalAmount: total,
      items: items.map((i, idx) => ({
        id: idx.toString(),
        description: i.desc,
        quantity: i.qty,
        unitPrice: i.price,
        taxRate: 0
      }))
    };
    onAddInvoice(newInvoice);
    setShowForm(false);
    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setDueDate('');
    setItems([{ desc: 'Service Charge', price: 0, qty: 1 }]);
  };

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #333; }
            .invoice-details { text-align: right; }
            .bill-to { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; border-bottom: 2px solid #eee; padding: 10px 0; color: #777; text-transform: uppercase; font-size: 12px; }
            td { padding: 15px 0; border-bottom: 1px solid #eee; }
            .total-section { text-align: right; }
            .total-row { font-size: 20px; font-weight: bold; margin-top: 10px; }
            .footer { margin-top: 50px; text-align: center; color: #aaa; font-size: 12px; }
            .status { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-top: 10px; }
            .status.paid { background: #d1fae5; color: #065f46; }
            .status.unpaid { background: #fef3c7; color: #92400e; }
            .status.overdue { background: #fee2e2; color: #b91c1c; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Balance Book</div>
            <div class="invoice-details">
              <h1>INVOICE</h1>
              <p>#${invoice.invoiceNumber}</p>
              <p>Date: ${invoice.date}</p>
              <p>Due: ${invoice.dueDate}</p>
              <span class="status ${invoice.status.toLowerCase()}">${invoice.status}</span>
            </div>
          </div>

          <div class="bill-to">
            <h3>Bill To:</h3>
            <p>${invoice.customerName}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td style="text-align: right;">${formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <p>Subtotal: ${formatCurrency(invoice.totalAmount)}</p>
            <p>Tax (0%): ${formatCurrency(0)}</p>
            <div class="total-row">Total: ${formatCurrency(invoice.totalAmount)}</div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Balance Book Inc.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleEmail = (invoice: Invoice) => {
    const subject = `Invoice ${invoice.invoiceNumber} from Balance Book`;
    const body = `Dear ${invoice.customerName},%0D%0A%0D%0APlease find details of your invoice #${invoice.invoiceNumber} below.%0D%0A%0D%0AAmount Due: ${formatCurrency(invoice.totalAmount)}%0D%0ADue Date: ${invoice.dueDate}%0D%0A%0D%0AThank you for your business.%0D%0A%0D%0ABest regards,%0D%0ABalance Book Team`;
    window.location.href = `mailto:${customerEmail || ''}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-6 animate-fade-in pb-24">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage client billings and payments</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center gap-2"
        >
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl animate-slide-up my-8 border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Create New Invoice</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                  <input 
                    required
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="Client Company Ltd."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Email (Optional)</label>
                  <input 
                    type="email" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="billing@client.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input 
                    required
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Invoice Items</label>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="Description"
                        value={item.desc}
                        onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                        className="flex-[2] px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Qty"
                        value={item.qty}
                        min="1"
                        onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                      />
                      <input 
                        type="number" 
                        placeholder="Price"
                        value={item.price}
                        min="0"
                        step="0.01"
                        onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                        className="w-28 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                      />
                      <button 
                        type="button"
                        onClick={() => removeItem(idx)} 
                        className="p-2 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={addItem}
                  className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Line Item
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="text-right flex-1">
                  <span className="text-slate-500 dark:text-slate-400 text-sm mr-3">Total Amount:</span>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                Issue Invoice
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all group relative overflow-visible">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors rounded-l-2xl"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{invoice.customerName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{invoice.invoiceNumber}</p>
                </div>
              </div>
              
              {/* Dropdown Menu */}
              <div className="relative">
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id);
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {activeMenuId === invoice.id && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                        <div className="absolute right-0 top-8 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden animate-fade-in flex flex-col py-1">
                            <button 
                                onClick={() => { onUpdateInvoice({...invoice, status: 'Paid'}); setActiveMenuId(null); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 text-left transition-colors"
                            >
                                <CheckCircle size={14} /> Mark as Paid
                            </button>
                            <button 
                                onClick={() => { onUpdateInvoice({...invoice, status: 'Unpaid'}); setActiveMenuId(null); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 text-left transition-colors"
                            >
                                <Clock size={14} /> Mark as Unpaid
                            </button>
                             <button 
                                onClick={() => { onUpdateInvoice({...invoice, status: 'Overdue'}); setActiveMenuId(null); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 text-left transition-colors"
                            >
                                <AlertTriangle size={14} /> Mark as Overdue
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                            <button 
                                onClick={() => { onDeleteInvoice(invoice.id); setActiveMenuId(null); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-left transition-colors"
                            >
                                <Trash2 size={14} /> Delete Invoice
                            </button>
                        </div>
                    </>
                  )}
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 dark:text-slate-400">Amount</span>
                 <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(invoice.totalAmount)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 dark:text-slate-400">Due Date</span>
                 <span className="text-slate-700 dark:text-slate-300">{invoice.dueDate}</span>
               </div>
               <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-500 dark:text-slate-400">Status</span>
                 <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                   invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                   invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                 }`}>
                   {invoice.status === 'Paid' && <CheckCircle size={12} />}
                   {invoice.status === 'Overdue' && <AlertTriangle size={12} />}
                   {invoice.status === 'Unpaid' && <Clock size={12} />}
                   {invoice.status}
                 </span>
               </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => handlePrint(invoice)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                <Download size={14} /> PDF
              </button>
              <button 
                onClick={() => handleEmail(invoice)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                <Mail size={14} /> Email
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;