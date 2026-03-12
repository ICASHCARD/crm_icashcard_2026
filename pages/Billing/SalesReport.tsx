
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  LayoutList, 
  Users,
  FileBarChart
} from 'lucide-react';

interface CommissionRecord {
  id: string;
  date: string;
  client: string;
  netValue: number;
  grossValue: number;
  commission: number;
  percentage: string;
  table: string;
  term: number;
  digitador: string;
  status: 'Pago' | 'Não pago';
}

interface AgentGroup {
  agentName: string;
  profile: string;
  records: CommissionRecord[];
}

const SalesReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const reportData: AgentGroup[] = [
    {
      agentName: 'José da silva oliveira',
      profile: 'Gerente comercial',
      records: [
        { id: '1772', date: '16-01-2026', client: 'Maria elisa desiderio', netValue: 2000.00, grossValue: 2469.60, commission: 10.00, percentage: '0.50%', table: 'Flex-8-rosa', term: 12, digitador: 'Millena brito rodrigues da silva', status: 'Não pago' },
        { id: '1771', date: '16-01-2026', client: 'Antonia de sousa loiola', netValue: 673.47, grossValue: 825.00, commission: 3.37, percentage: '0.50%', table: 'Flex-8-rosa', term: 10, digitador: 'Yara letícia cabral da cruz', status: 'Não pago' },
      ]
    },
    {
      agentName: 'Pillon e buchland assessoria',
      profile: 'Corban',
      records: [
        { id: '1788', date: '19-01-2026', client: 'Tatiana maria canha', netValue: 450.00, grossValue: 647.46, commission: 45.00, percentage: '10.00%', table: 'Flex-1-roxa', term: 12, digitador: 'Karla pillon buchland monteiro de lima', status: 'Não pago' },
      ]
    }
  ];

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mesa de comissão</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Análise de produção e fechamento de comissionamento.</p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
           <Filter size={14} /> Filtros de pesquisa
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Data inicial</label>
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Data final</label>
                <div className="flex items-center gap-3">
                   <input type="date" className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none" />
                   <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shrink-0">Filtrar</button>
                </div>
              </div>
           </div>
           
           <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Cargo</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none font-medium">
                 <option>Todos os cargos</option>
                 <option>Gerente comercial</option>
                 <option>Corban</option>
              </select>
           </div>

           <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Status</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none font-medium">
                 <option>Não pago</option>
                 <option>Pago</option>
              </select>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
               <option>25 itens</option>
               <option>50 itens</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
               Exportar <Download size={14} />
            </button>
         </div>
         
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Procurar registro..." className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:ring-2 ring-blue-500/20 w-64" />
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Data liberação</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4 text-right">Vl. líquido</th>
                <th className="px-6 py-4 text-right">Vl. bruto</th>
                <th className="px-6 py-4 text-right">Comissão</th>
                <th className="px-6 py-4 text-center">%</th>
                <th className="px-6 py-4">Tabela</th>
                <th className="px-6 py-4 text-center">Prazo</th>
                <th className="px-6 py-4">Digitador</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {reportData.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                     <td colSpan={11} className="px-6 py-2.5">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                              <span className="text-slate-400">Agente:</span> {group.agentName}
                              <span className="mx-2 text-slate-200">|</span>
                              <span className="text-slate-400">Perfil:</span> {group.profile}
                           </div>
                           <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                              Total ganho: <span className="text-emerald-600 ml-1">{formatCurrency(group.records.reduce((acc, curr) => acc + curr.commission, 0))}</span>
                           </div>
                        </div>
                     </td>
                  </tr>

                  {group.records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">{rec.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{rec.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{rec.client}</td>
                      <td className="px-6 py-4 text-sm text-right text-slate-600">{formatCurrency(rec.netValue)}</td>
                      <td className="px-6 py-4 text-sm text-right text-slate-600">{formatCurrency(rec.grossValue)}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-emerald-600">{formatCurrency(rec.commission)}</td>
                      <td className="px-6 py-4 text-xs text-center text-blue-600">{rec.percentage}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{rec.table}</td>
                      <td className="px-6 py-4 text-sm text-center text-slate-600">{rec.term}x</td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-[150px] truncate">{rec.digitador}</td>
                      <td className="px-6 py-4 text-right">
                         <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-500 text-[10px] font-bold">
                           {rec.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
               <tr className="bg-slate-50/50 font-medium text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800">
                  <td colSpan={3} className="px-6 py-4 text-xs">Total geral</td>
                  <td className="px-6 py-4 text-right text-sm">R$ 23.436,48</td>
                  <td className="px-6 py-4 text-right text-sm">R$ 29.180,52</td>
                  <td className="px-6 py-4 text-right text-sm text-emerald-600">R$ 426,50</td>
                  <td colSpan={5}></td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
         <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:scale-95">
            Processar comissões
         </button>
         
         <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg">Anterior</button>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">1</div>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg">Próximo</button>
         </div>
      </div>
    </div>
  );
};

export default SalesReport;
