
import React, { useState } from 'react';
import { Search, Plus, Layers, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const CommissionGroups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const groups = [
    { id: 1, name: 'Grupo A', description: 'Produtos de Baixo Risco', tables: 5 },
    { id: 2, name: 'Grupo B', description: 'Produtos Premium High-End', tables: 12 },
    { id: 3, name: 'Grupo C', description: 'Novos Lançamentos', tables: 2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Grupos de Comissão</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Categorização e agrupamento de regras comerciais.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg uppercase tracking-widest active:scale-95">
          <Plus size={20} /> Novo Grupo
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar grupo..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5">GRUPO</th>
                <th className="px-6 py-5">DESCRIÇÃO</th>
                <th className="px-6 py-5 text-center">TABELAS VINCULADAS</th>
                <th className="px-6 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {groups.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center"><Layers size={20} /></div>
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">{item.tables} tabelas</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><Edit2 size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionGroups;
