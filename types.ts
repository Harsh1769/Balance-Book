export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export enum TransactionCategory {
  SALES = 'Sales',
  SALARY = 'Salary',
  TRAVEL = 'Travel',
  TOOLS = 'Tools',
  RENT = 'Rent',
  MARKETING = 'Marketing',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  status: 'Completed' | 'Pending';
  receiptUrl?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'Paid' | 'Unpaid' | 'Overdue';
  totalAmount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  lowStockThreshold: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
}
