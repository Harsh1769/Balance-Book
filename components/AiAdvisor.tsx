import React, { useState, useEffect, useRef } from 'react';
import { generateFinancialAdvice } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Transaction, Invoice, BankAccount } from '../types';
import { CurrencyCode } from '../App';
import { EXCHANGE_RATES } from '../constants';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
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
    { role: 'ai', content: `Hello! I am BalanceBot. I can analyze your ledger, summarize expenses, or draft emails for clients. How can I help you today?`, timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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

    const responseText = await generateFinancialAdvice(input, context);

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
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
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
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your total assets, profit, or invoice status..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none h-14 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">AI can make mistakes. Please verify important financial data.</p>
      </div>
    </div>
  );
};

export default AiAdvisor;