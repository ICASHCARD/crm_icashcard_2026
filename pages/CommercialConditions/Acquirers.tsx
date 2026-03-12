
import React, { useState } from 'react';
import { Search, Plus, CreditCard, MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

const Acquirers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const fintechs = [
    { id: 1, name: 'Icashcard', cnpj: '12.345.678/0001-00', status: 'Ativo' },
    { id: 2, name: 'Icard', cnpj: '98.765.432/0001-99', status: 'Ativo' },
    { id: 3, name: 'PWG', cnpj: '45.678.901/0001-55', status: 'Ativo' },
  ];

  const filtered = fintechs.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Fintechs</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestão de parceiros e instituições de pagamento.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg uppercase tracking-widest active:scale-95">
          <Plus size={20} /> Nova Fintech
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
              placeholder="Pesquisar fintech..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5">FINTECH</th>
                <th className="px-6 py-5">CNPJ</th>
                <th className="px-6 py-5">SITUAÇÃO</th>
                <th className="px-6 py-5 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div>
                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.cnpj}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${item.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {item.status}
                    </span>
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

export default Acquirers;
