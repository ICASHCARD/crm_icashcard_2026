
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Calendar as CalendarIcon, 
  Edit3, 
  FileUp,
  X,
  Save,
  Trash2,
  Table as TableIcon,
  CreditCard,
  Layers,
  Percent,
  ClipboardPaste,
  ArrowRight,
  Hash,
  Globe,
  Link as LinkIcon,
  SmartphoneNfc,
  Check,
  Copy,
  CheckCircle2
} from 'lucide-react';
import Toggle from '../../components/ui/Toggle';

interface InstallmentRow {
  number: number;
  totalToPay: number;
  isActive: boolean;
}

interface CommissionTable {
  id: number;
  date: string;
  startDate: string;
  tableName: string;
  slug: string;
  acquirer: string;
  isLink: boolean;
  isMachine: boolean;
  validity: string;
  status: boolean;
  installments: InstallmentRow[];
}

interface Toast {
  id: number;
  message: string;
}

const CommissionTables: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<CommissionTable | null>(null);
  const [importText, setImportText] = useState('');
  const [firstInstallment, setFirstInstallment] = useState(1);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [tables, setTables] = useState<CommissionTable[]>(() => {
    const saved = localStorage.getItem('nexus_commission_tables');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: 1, 
        date: '2023-10-20', 
        startDate: '2023-10-21', 
        tableName: 'Flex 6 verde', 
        slug: 'flex-6-verde',
        acquirer: 'Icashcard', 
        isLink: true,
        isMachine: false,
        validity: '2024-12-31', 
        status: true, 
        installments: [
          { number: 1, totalToPay: 1200, isActive: true },
          { number: 12, totalToPay: 1258.80, isActive: true },
        ] 
      },
      { 
        id: 2, 
        date: '2023-11-05', 
        startDate: '2023-11-06', 
        tableName: 'Premium gold', 
        slug: 'premium-gold',
        acquirer: 'Icard', 
        isLink: false,
        isMachine: true,
        validity: '2025-06-30', 
        status: true, 
        installments: [
          { number: 1, totalToPay: 1100, isActive: true },
          { number: 24, totalToPay: 1500, isActive: true },
        ] 
      },
    ];
  });

  const [form, setForm] = useState<Partial<CommissionTable>>({
    installments: [],
    isLink: false,
    isMachine: false
  });

  useEffect(() => {
    localStorage.setItem('nexus_commission_tables', JSON.stringify(tables));
  }, [tables]);

  const addToast = (message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleCopyLink = (slug: string) => {
    const generatedLink = `https://nexus.pag/${slug}`;
    navigator.clipboard.writeText(generatedLink).then(() => {
      addToast(`Link copiado: ${generatedLink}`);
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    setForm(prev => {
      const updates: any = { tableName: normalizedName };
      if (!isSlugManual) {
        updates.slug = generateSlug(name);
      }
      return { ...prev, ...updates };
    });
  };

  const handleSlugChange = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm(prev => ({ ...prev, slug: cleanSlug }));
    setIsSlugManual(true);
  };

  const filteredTables = useMemo(() => {
    return tables.filter(t => 
      t.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.acquirer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tables]);

  const getMaxActiveInstallment = (installments: InstallmentRow[]) => {
    const active = installments.filter(i => i.isActive);
    if (active.length === 0) return '0x';
    const max = Math.max(...active.map(i => i.number));
    return `${max}x`;
  };

  const handleOpenModal = (table?: CommissionTable) => {
    setIsSlugManual(!!table);
    if (table) {
      setEditingTable(table);
      setForm(table);
    } else {
      setEditingTable(null);
      setForm({
        date: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        status: true,
        tableName: '',
        slug: '',
        acquirer: '',
        isLink: false,
        isMachine: false,
        validity: '',
        installments: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.tableName || (!form.isLink && !form.isMachine)) {
      alert("Por favor, informe o nome da tabela e selecione pelo menos um modo de operação (Link ou Maquininha).");
      return;
    }

    if (editingTable) {
      setTables(prev => prev.map(t => t.id === editingTable.id ? (form as CommissionTable) : t));
    } else {
      const newTable = {
        ...form,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      } as CommissionTable;
      setTables(prev => [newTable, ...prev]);
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: number) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: !t.status } : t));
  };

  const addInstallmentRow = () => {
    const lastRow = form.installments?.[form.installments.length - 1];
    const nextNumber = lastRow ? lastRow.number + 1 : 1;
    const newRow: InstallmentRow = { number: nextNumber, totalToPay: 0, isActive: true };
    setForm(prev => ({ ...prev, installments: [...(prev.installments || []), newRow] }));
  };

  const updateInstallment = (index: number, updates: Partial<InstallmentRow>) => {
    const updated = [...(form.installments || [])];
    updated[index] = { ...updated[index], ...updates };
    setForm(prev => ({ ...prev, installments: updated }));
  };

  const removeInstallment = (index: number) => {
    const updated = (form.installments || []).filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, installments: updated }));
  };

  const calculateInterest = (total: number) => {
    if (!total || total === 0) return "0.00";
    const interest = ((total - 1000) / 1000) * 100;
    return interest.toFixed(2);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast Layer */}
      <div className="fixed top-24 right-8 z-[300] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300 pointer-events-auto border border-white/10 backdrop-blur-md">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Cadastro - Tabela de comissão</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie as regras de comissionamento e tabelas comerciais.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest active:scale-95"
          >
            <Plus size={20} /> Cadastrar nova
          </button>
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg uppercase tracking-widest active:scale-95">
            <FileUp size={20} /> Importar nova
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Tabelas de comissões cadastradas</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar na tabela..." 
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 ring-blue-500 dark:text-white w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
             <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold rounded-lg px-3 py-1.5 outline-none dark:text-white">
               <option>25 itens</option>
               <option>50 itens</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5">DATA CADASTRO</th>
                <th className="px-6 py-5">NOME DA TABELA</th>
                <th className="px-6 py-5">FINTECH</th>
                <th className="px-6 py-5">MODO</th>
                <th className="px-6 py-5">PRAZO</th>
                <th className="px-6 py-5">DT. INÍCIO</th>
                <th className="px-6 py-5">DT. VALIDADE</th>
                <th className="px-6 py-5 text-right tracking-widest">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTables.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 text-xs text-slate-500 font-normal">{formatDate(item.date)}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-normal text-slate-900 dark:text-white">{item.tableName}</p>
                    <p className="text-[9px] font-mono text-slate-400">/{item.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-slate-600 dark:text-slate-400">{item.acquirer}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {item.isLink && (
                        <button 
                          onClick={() => handleCopyLink(item.slug)}
                          title="Clique para copiar o link de pagamento"
                          className="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-100 uppercase flex items-center gap-1 hover:bg-blue-100 transition-colors active:scale-95"
                        >
                          Link <Copy size={10} />
                        </button>
                      )}
                      {item.isMachine && <span className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-100 uppercase">Maq</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-normal text-slate-400 mr-1 uppercase tracking-tight">Até</span>
                    <span className="text-xs font-normal text-blue-600 uppercase tracking-tighter bg-blue-50/50 dark:bg-blue-900/10 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900/30 w-fit">
                      {getMaxActiveInstallment(item.installments)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-normal text-slate-500">{formatDate(item.startDate)}</td>
                  <td className="px-6 py-4 text-xs font-normal text-slate-500">{formatDate(item.validity)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <Toggle enabled={item.status} onChange={() => toggleStatus(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total: {filteredTables.length} registros</p>
          <div className="flex items-center gap-2">
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 transition-all">Anterior</button>
            <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 transition-all">Próximo</button>
          </div>
        </div>
      </div>

      {/* Modal Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-950 rounded-[48px] w-full max-w-6xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500 max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
                  <TableIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {editingTable ? `Editar tabela #${editingTable.id}` : 'Nova tabela de comissão'}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configurações comerciais</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Dados base</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome da tabela</label>
                    <input 
                      type="text" 
                      value={form.tableName} 
                      onChange={e => handleNameChange(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all font-normal dark:text-white" 
                      placeholder="Ex: Flex 6 verde" 
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                      <Globe size={10} /> Slug da url
                    </label>
                    <input 
                      type="text" 
                      value={form.slug} 
                      onChange={e => handleSlugChange(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all font-mono text-blue-600 dark:text-blue-400" 
                      placeholder="slug-da-url" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fintech</label>
                    <div className="relative">
                      <select 
                        value={form.acquirer} 
                        onChange={e => setForm({...form, acquirer: e.target.value})} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all appearance-none font-normal dark:text-white"
                      >
                        <option value="">Selecione...</option>
                        <option value="Icashcard">Icashcard</option>
                        <option value="Icard">Icard</option>
                        <option value="PWG">Pwg</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Modo de operação</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         type="button"
                         onClick={() => setForm({...form, isLink: !form.isLink})}
                         className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${
                           form.isLink 
                             ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500' 
                             : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                         }`}
                       >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            form.isLink ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
                          }`}>
                            <LinkIcon size={20} />
                          </div>
                          <div className="text-left">
                            <p className={`text-xs font-bold ${form.isLink ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>Link</p>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Pagamento digital</p>
                          </div>
                          {form.isLink && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                              <Check size={10} strokeWidth={4} />
                            </div>
                          )}
                       </button>

                       <button 
                         type="button"
                         onClick={() => setForm({...form, isMachine: !form.isMachine})}
                         className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all group ${
                           form.isMachine 
                             ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-500' 
                             : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                         }`}
                       >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            form.isMachine ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-400 dark:bg-slate-800'
                          }`}>
                            <SmartphoneNfc size={20} />
                          </div>
                          <div className="text-left">
                            <p className={`text-xs font-bold ${form.isMachine ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>Maquininha</p>
                            <p className="text-[9px] text-slate-400 font-medium leading-tight">Presencial físico</p>
                          </div>
                          {form.isMachine && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-sm">
                              <Check size={10} strokeWidth={4} />
                            </div>
                          )}
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Configuração comercial</h3>
                  </div>
                  <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-2.5 rounded-2xl uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95"
                  >
                    <ClipboardPaste size={14} /> Importar parcelas
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="col-span-1 text-center">Parcela</div>
                    <div className="col-span-4">Total a pagar (R$)</div>
                    <div className="col-span-3">Juros (%) <span className="text-[8px] opacity-60 ml-1 italic">(base 1000)</span></div>
                    <div className="col-span-2 text-center">Ativar</div>
                    <div className="col-span-2 text-right px-4">Remover</div>
                  </div>
                  
                  <div className="space-y-3">
                    {form.installments?.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-6 items-center bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="col-span-1">
                          <input 
                            type="number" 
                            value={row.number} 
                            onChange={e => updateInstallment(idx, { number: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-3 text-sm font-black text-blue-600 text-center outline-none focus:ring-2 ring-blue-500/20"
                          />
                        </div>
                        <div className="col-span-4">
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">R$</div>
                            <input 
                              type="number" 
                              value={row.totalToPay || ''} 
                              onChange={e => updateInstallment(idx, { totalToPay: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 ring-blue-500/20 font-normal dark:text-white"
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-normal text-emerald-600 flex items-center gap-2">
                             <Percent size={14} className="opacity-60" />
                             {calculateInterest(row.totalToPay)}%
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Toggle enabled={row.isActive} onChange={() => updateInstallment(idx, { isActive: !row.isActive })} />
                        </div>
                        <div className="col-span-2 text-right px-4">
                          <button onClick={() => removeInstallment(idx)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={addInstallmentRow}
                      className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[28px] text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-3 bg-white/50 dark:bg-transparent group"
                    >
                      <Plus size={20} className="group-hover:scale-110 transition-transform" /> Adicionar parcela manualmente
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Prazos e validade</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data de início</label>
                    <div className="relative">
                       <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all font-normal dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data de validade</label>
                    <div className="relative">
                       <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input type="date" value={form.validity} onChange={e => setForm({...form, validity: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 transition-all font-normal dark:text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Estado da tabela</label>
                    <div className="flex items-center gap-4">
                       <Toggle enabled={form.status || false} onChange={() => setForm({...form, status: !form.status})} />
                       <span className={`text-xs font-black uppercase tracking-widest ${form.status ? 'text-emerald-600' : 'text-slate-400'}`}>
                         {form.status ? 'Ativa para uso' : 'Inativa'}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 flex justify-end gap-6">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Cancelar</button>
              <button 
                onClick={handleSave}
                className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all flex items-center gap-3 active:scale-[0.98]"
              >
                <Save size={20} /> {editingTable ? 'Salvar alterações' : 'Criar nova tabela'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionTables;
