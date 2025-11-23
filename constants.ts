import { Transaction, TransactionType, TransactionCategory, Invoice, Product, BankAccount } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2023-10-25',
    description: 'Q3 Consulting Services',
    amount: 12500.00,
    type: TransactionType.INCOME,
    category: TransactionCategory.SALES,
    status: 'Completed',
  },
  {
    id: '2',
    date: '2023-10-26',
    description: 'Office Rent - October',
    amount: 2000.00,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.RENT,
    status: 'Completed',
  },
  {
    id: '3',
    date: '2023-10-27',
    description: 'Client Meeting Travel',
    amount: 450.50,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.TRAVEL,
    status: 'Pending',
    receiptUrl: 'https://picsum.photos/200/300',
  },
  {
    id: '4',
    date: '2023-10-28',
    description: 'Software Licenses',
    amount: 199.00,
    type: TransactionType.EXPENSE,
    category: TransactionCategory.TOOLS,
    status: 'Completed',
  },
  {
    id: '5',
    date: '2023-10-29',
    description: 'Product Sale - Bulk',
    amount: 5600.00,
    type: TransactionType.INCOME,
    category: TransactionCategory.SALES,
    status: 'Completed',
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2023-001',
    customerName: 'Acme Corp Global',
    date: '2023-10-01',
    dueDate: '2023-10-31',
    status: 'Unpaid',
    totalAmount: 5400.00,
    items: [
      { id: '1', description: 'Consulting Hours', quantity: 10, unitPrice: 500, taxRate: 8 }
    ]
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2023-002',
    customerName: 'Stark Industries',
    date: '2023-09-15',
    dueDate: '2023-10-15',
    status: 'Overdue',
    totalAmount: 12000.00,
    items: []
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2023-003',
    customerName: 'Wayne Enterprises',
    date: '2023-10-20',
    dueDate: '2023-11-20',
    status: 'Paid',
    totalAmount: 3500.00,
    items: []
  }
];

export const MOCK_INVENTORY: Product[] = [
  { id: 'p1', name: 'Ergonomic Chair', sku: 'FUR-001', stock: 45, price: 250, lowStockThreshold: 10 },
  { id: 'p2', name: 'Wireless Mouse', sku: 'TEC-002', stock: 8, price: 45, lowStockThreshold: 15 },
  { id: 'p3', name: 'Mechanical Keyboard', sku: 'TEC-003', stock: 120, price: 120, lowStockThreshold: 20 },
];

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'ba1', bankName: 'Chase Business', accountNumber: '**** 4321', balance: 145200.50, currency: 'USD' },
  { id: 'ba2', bankName: 'Wise International', accountNumber: '**** 8899', balance: 12500.00, currency: 'EUR' },
];

// Base currency is USD
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.50,
  JPY: 150.00,
};