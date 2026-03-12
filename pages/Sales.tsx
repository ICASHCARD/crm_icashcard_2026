
import React, { useState, useMemo } from 'react';
import { mockSales } from '../data/mockData';
import { Search, Calendar, Filter, Download, Plus, MoreVertical, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { SaleStatus } from '../types';

const StatusBadge: React.FC<{ status: SaleStatus }> = ({ status }) => {
  const styles: Record<SaleStatus, string> = {
    'Faturado': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pendente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Cancelado': 'bg-rose-50 text-rose-700 border-rose-100',
    'Aguardando Pagamento': 'bg-blue-50 text-blue-700 border-blue-100',
  };

  const Icons: Record<SaleStatus, React.ReactNode> = {
    'Faturado': <CheckCircle size={12} />,
    'Pendente': <Clock size={12} />,
    'Cancelado': <XCircle size={12} />,
    'Aguardando Pagamento': <AlertCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
      {Icons[status]}
      {status}
    </span>
  );
};

const TagPill: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
    {label}
  </span>
);

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  const filteredSales = useMemo(() => {
    return mockSales.filter(sale => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        sale.code.toLowerCase().includes(term) ||
        sale.legalName.toLowerCase().includes(term) ||
        sale.tradingName.toLowerCase().includes(term) ||
        sale.taxId.includes(term) ||
        sale.category.toLowerCase().includes(term) ||
        sale.tags.some(t => t.toLowerCase().includes(term));
      
      const matchesStatus = statusFilter === 'Todos' || sale.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Vendas & Pedidos</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Acompanhe todos os pedidos e faturamentos em tempo real.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg uppercase tracking-widest">
          <Plus size={20} /> Nova Venda
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por código, cliente ou CNPJ..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-2xl px-5 py-3 outline-none focus:ring-2 ring-blue-500 dark:text-white"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Faturado">Faturado</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Aguardando Pagamento">Aguardando Pagamento</option>
            </select>
            <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">SITUAÇÃO</th>
                <th className="px-6 py-4">CLIENTE</th>
                <th className="px-6 py-4 text-right">VALOR DO PEDIDO</th>
                <th className="px-6 py-4">CÓDIGO</th>
                <th className="px-6 py-4">CATEGORIA</th>
                <th className="px-6 py-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4"><StatusBadge status={sale.status} /></td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{sale.tradingName}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{sale.taxId}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">R$ {sale.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sale.installments}x parcelas</p>
                  </td>
                  <td className="px-6 py-4"><span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900">{sale.code}</span></td>
                  <td className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">{sale.category}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && <div className="py-20 text-center text-slate-400 text-sm font-bold">Nenhuma venda encontrada.</div>}
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registros filtrados: {filteredSales.length}</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed">Anterior</button>
            <button className="px-4 py-2 text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
