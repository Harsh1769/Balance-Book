import React, { useState, useEffect, useRef } from 'react';
import { generateFinancialAdvice } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2, Camera, X, Image as ImageIcon } from 'lucide-react';
import { Transaction, Invoice, BankAccount } from '../types';
import { CurrencyCode } from '../App';
import { EXCHANGE_RATES } from '../constants';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: string;
}

interface AiAdvisorProps {
  transactions: Transaction[];
  invoices: Invoice[];
  accounts: BankAccount[];
  currency: CurrencyCode;
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ transactions, invoices, accounts, currency }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello! I am BalanceBot. I can analyze your ledger, summarize expenses, draft emails for clients, or analyze financial documents you upload. How can I help you today?`, timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = { 
        role: 'user', 
        content: input, 
        timestamp: new Date(),
        image: selectedImage || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Store image locally for this request and clear state
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    // Calculate Total Liquidity for Context
    const totalLiquidAssets = accounts.reduce((acc, curr) => {
       const rateToUSD = 1 / (EXCHANGE_RATES[curr.currency] || 1);
       const amountInUSD = curr.balance * rateToUSD;
       const rateToGlobal = EXCHANGE_RATES[currency] || 1;
       return acc + (amountInUSD * rateToGlobal);
    }, 0);

    // Combine context
    const context = {
      summary: "User Financial Data",
      reportingCurrency: currency,
      financialSnapshot: {
        totalLiquidAssets: totalLiquidAssets,
        accountDetails: accounts.map(a => ({ bank: a.bankName, balance: a.balance, currency: a.currency }))
      },
      recentTransactions: transactions.slice(0, 10),
      outstandingInvoices: invoices.filter(i => i.status !== 'Paid'),
    };

    let base64Data: string | undefined;
    let mimeType: string | undefined;

    if (currentImage) {
        // Extract base64 part
        base64Data = currentImage.split(',')[1];
        mimeType = currentImage.split(';')[0].split(':')[1];
    }

    const responseText = await generateFinancialAdvice(
        userMessage.content || (currentImage ? "Analyze this image" : ""), 
        context, 
        base64Data, 
        mimeType
    );

    const aiMessage: Message = { role: 'ai', content: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden m-6">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">BalanceBot AI</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online & Analyzing in {currency}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.image && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs shadow-md">
                        <img src={msg.image} alt="Uploaded content" className="w-full h-auto" />
                    </div>
                )}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                    ? 'bg-slate-900 dark:bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                }`}>
                    {msg.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 min-h-[1em]">{line}</p>
                    ))}
                    <span className={`text-[10px] block mt-2 opacity-70 ${msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
               <Bot size={16} />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        
        {/* Image Preview Area */}
        {selectedImage && (
            <div className="mb-3 flex items-center gap-3 animate-slide-up">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={selectedImage} alt="Preview" className="h-full w-full object-cover" />
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                    >
                        <X size={12} />
                    </button>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Image attached
                </div>
            </div>
        )}

        <div className="relative flex items-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Upload image"
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*"
          />

          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Add a caption..." : "Ask about your total assets or upload a doc..."}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none h-12 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="p-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">AI can make mistakes. Please verify important financial data.</p>
      </div>
    </div>
  );
};

export default AiAdvisor;