
import React, { useState, useMemo } from 'react';
import { mockInvoices } from '../data/mockData';
import { Search, Plus, Filter, Download, FileText, CheckCircle, XCircle, Clock, MoreVertical } from 'lucide-react';
import { InvoiceStatus, InvoiceType } from '../types';

const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const styles = {
    'Autorizada': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Cancelada': 'bg-rose-50 text-rose-700 border-rose-100',
    'Pendente': 'bg-orange-50 text-orange-700 border-orange-100',
    'Inutilizada': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const Icons = {
    'Autorizada': <CheckCircle size={12} />,
    'Cancelada': <XCircle size={12} />,
    'Pendente': <Clock size={12} />,
    'Inutilizada': <FileText size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
      {Icons[status]}
      {status}
    </span>
  );
};

const TypeBadge = ({ type }: { type: InvoiceType }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${type === 'Entrada' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
    {type}
  </span>
);

const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter(invoice => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        invoice.number.toLowerCase().includes(term) ||
        invoice.legalName.toLowerCase().includes(term) ||
        invoice.tradingName.toLowerCase().includes(term) ||
        invoice.taxId.includes(term) ||
        invoice.operation.toLowerCase().includes(term);
      
      const matchesStatus = statusFilter === 'Todos' || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">NF-e (Notas Fiscais)</h1>
          <p className="text-slate-500">Gestão e acompanhamento de emissões e recebimentos de notas fiscais.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus size={20} />
          Emitir NF-e
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por número, razão social ou CNPJ..." 
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500 text-slate-900"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Autorizada">Autorizada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Pendente">Pendente</option>
              <option value="Inutilizada">Inutilizada</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={14} />
              XML/PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">TIPO</th>
                <th className="px-6 py-4">EMISSÃO</th>
                <th className="px-6 py-4">REGISTRO</th>
                <th className="px-6 py-4">SITUAÇÃO</th>
                <th className="px-6 py-4">OPERAÇÃO</th>
                <th className="px-6 py-4">NÚMERO</th>
                <th className="px-6 py-4">CNPJ/CPF</th>
                <th className="px-6 py-4">RAZÃO SOCIAL</th>
                <th className="px-6 py-4">NOME FANTASIA</th>
                <th className="px-6 py-4 text-right">VALOR</th>
                <th className="px-6 py-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <TypeBadge type={invoice.type} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(invoice.registrationDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 italic">
                    {invoice.operation}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {invoice.number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {invoice.taxId}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {invoice.legalName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {invoice.tradingName || '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    R$ {invoice.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">Nenhuma nota fiscal encontrada.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
