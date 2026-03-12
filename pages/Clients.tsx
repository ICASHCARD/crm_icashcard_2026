
import React, { useState, useMemo } from 'react';
import { mockPeople } from '../data/mockData';
import { Search, Filter, Download, MoreVertical, Plus, CheckCircle, XCircle } from 'lucide-react';
import { PersonStatus, PersonTag } from '../types';

const StatusBadge: React.FC<{ status: PersonStatus }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
    status === 'Ativo' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
      : 'bg-slate-100 text-slate-500 border-slate-200'
  }`}>
    {status}
  </span>
);

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPeople = useMemo(() => {
    return mockPeople.filter(person => {
      const term = searchTerm.toLowerCase();
      return (
        person.name.toLowerCase().includes(term) ||
        person.taxId.includes(term)
      );
    });
  }, [searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Clientes & Parceiros</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestão estratégica da carteira de contatos.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest">
          <Plus size={20} /> Novo Registro
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
              placeholder="Pesquisar por nome ou CPF/CNPJ..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5">STATUS</th>
                <th className="px-6 py-5">RAZÃO SOCIAL / NOME</th>
                <th className="px-6 py-5">CNPJ/CPF</th>
                <th className="px-6 py-5">INCLUSÃO</th>
                <th className="px-6 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPeople.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4"><StatusBadge status={person.status} /></td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{person.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{person.email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">{person.taxId}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">{new Date(person.inclusionDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total: {filteredPeople.length} registros</p>
          <div className="flex items-center gap-2">
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">Anterior</button>
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
