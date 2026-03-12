
import React, { useState, useMemo } from 'react';
import { mockFinancial } from '../data/mockData';
import { Filter, Download, Plus, AlertCircle, CheckCircle2, Clock, MoreVertical, Search } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Receivable' | 'Payable'>('Receivable');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRecords = useMemo(() => {
    return mockFinancial.filter(record => {
      const matchesTab = record.type === activeTab;
      const term = searchTerm.toLowerCase();
      return matchesTab && (record.personName.toLowerCase().includes(term) || record.personTaxId.includes(term));
    });
  }, [activeTab, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Financeiro</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle de caixa e fluxo de pagamentos.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest">
          <Plus size={20} /> Lançar Título
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button onClick={() => setActiveTab('Receivable')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-[3px] transition-all ${activeTab === 'Receivable' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Contas a Receber</button>
          <button onClick={() => setActiveTab('Payable')} className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-[3px] transition-all ${activeTab === 'Payable' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Contas a Pagar</button>
        </div>

        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por cliente ou CNPJ..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5">VENCIMENTO</th>
                <th className="px-6 py-5">VALOR</th>
                <th className="px-6 py-5">CLIENTE / FAVORECIDO</th>
                <th className="px-6 py-5">SITUAÇÃO</th>
                <th className="px-6 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">{new Date(record.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white tracking-tight">R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{record.personName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${record.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{record.status === 'Paid' ? 'PAGO' : 'PENDENTE'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><MoreVertical size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exibindo {filteredRecords.length} títulos</p>
          <div className="flex items-center gap-2">
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">Anterior</button>
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
