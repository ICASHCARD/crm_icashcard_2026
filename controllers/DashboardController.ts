import { mockFinancial } from '@/data/mockData';
import { calculatePayables, calculateReceivables } from '@/helpers/calculations';

export class DashboardController {
  static async getSummary() {
    const receivable = calculateReceivables(mockFinancial);
    const payable = calculatePayables(mockFinancial);
    const overdue = mockFinancial.filter((item) => item.status === 'Overdue').length;

    return {
      receivable,
      payable,
      overdue,
    };
  }
}
