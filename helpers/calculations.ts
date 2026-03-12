import type { FinancialRecord, Sale } from '@/models/types';

export const calculateRevenue = (sales: Sale[]): number =>
  sales.reduce((acc, sale) => acc + sale.totalValue, 0);

export const calculateReceivables = (financial: FinancialRecord[]): number =>
  financial.filter((item) => item.type === 'Receivable').reduce((acc, item) => acc + item.amount, 0);

export const calculatePayables = (financial: FinancialRecord[]): number =>
  financial.filter((item) => item.type === 'Payable').reduce((acc, item) => acc + item.amount, 0);
