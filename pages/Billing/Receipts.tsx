
import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  X,
  CheckCircle2,
  Check,
  Banknote,
  Calendar,
  Trash2
} from 'lucide-react';

interface Receipt {
  paymentId: string;
  broker: string;
  profile: string;
  commission: number;
  date: string;
  status: 'Pendente' | 'Pago';
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const Receipts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([
    { paymentId: '905', broker: 'Fernando Abel Tavares De Morais Andrade', profile: 'Gerente Comercial', commission: 14.52, date: '16-01-2026', status: 'Pendente' },
    { paymentId: '904', broker: 'Camila Rocha', profile: 'Gerente Comercial', commission: 33.00, date: '16-01-2026', status: 'Pago' },
    { paymentId: '903', broker: 'Lucas Viniciues Ferreira Guirra Dos Santos', profile: 'Gerente Comercial', commission: 2.50, date: '16-01-2026', status: 'Pendente' },
    { paymentId: '902', broker: 'Fabio Junio Maia Coelho', profile: 'Gerente Comercial', commission: 7.78, date: '16-01-2026', status: 'Pago' },
    { paymentId: '901', broker: 'José Da Silva Oliveira', profile: 'Gerente Comercial', commission: 249.93, date: '16-01-2026', status: 'Pendente' },
  ]);

  // Função para garantir que nomes próprios sigam o padrão de primeira letra maiúscula
  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handlePay = (id: string) => {
    setReceipts(prev => prev.map(r => 
      r.paymentId === id ? { ...r, status: 'Pago' } : r
    ));
    addToast(`Pagamento #${id} processado com sucesso!`);
  };

  const handleDelete = (id: string) => {
    setReceipts(prev => prev.filter(r => r.paymentId !== id));
    addToast(`Recibo #${id} removido do sistema.`, 'error');
  };

  const filteredReceipts = receipts.filter(r => 
    r.broker.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.paymentId.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Toast System */}
      <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border animate-in slide-in-from-right-8 bg-white ${toast.type === 'error' ? 'border-rose-100 text-rose-600' : 'border-emerald-100 text-emerald-600'}`}>
            <CheckCircle2 size={18} />
            <p className="text-sm font-medium flex-1 text-slate-700">{toast.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recibos de comissão</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Histórico de pagamentos e comprovantes emitidos.</p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Colaborador</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none font-medium">
                 <option>Todos os colaboradores</option>
              </select>
           </div>
           <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Status</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none font-medium">
                 <option>Todos</option>
                 <option>Pendente</option>
                 <option>Pago</option>
              </select>
           </div>
           <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Data inicial</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none" />
              </div>
           </div>
           <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Data final</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none" />
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
               <option>25 itens</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
               Exportar <Download size={14} />
            </button>
         </div>
         
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID ou corretor..." 
              className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none w-64" 
            />
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Corretor</th>
                <th className="px-6 py-4">Perfil</th>
                <th className="px-6 py-4 text-right">Comissão</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredReceipts.map((item) => (
                <tr key={item.paymentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">#{item.paymentId}</span>
                      {/* Botão Remover visível apenas no hover da linha */}
                      <button 
                        onClick={() => handleDelete(item.paymentId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 size={12} /> Remover
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-normal">
                    {toTitleCase(item.broker)}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-normal">
                    {toTitleCase(item.profile)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-emerald-600">
                    R$ {item.commission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-normal">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => item.status === 'Pendente' && handlePay(item.paymentId)}
                        disabled={item.status === 'Pago'}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ${
                          item.status === 'Pago' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-not-allowed' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {item.status === 'Pago' ? <Check size={14} /> : <Banknote size={14} />}
                        {item.status === 'Pago' ? 'Pago' : 'Pagar'}
                      </button>

                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm">
                        Ver recibo
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReceipts.length === 0 && (
            <div className="py-20 text-center text-slate-400 text-sm italic">Nenhum registro encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts;
