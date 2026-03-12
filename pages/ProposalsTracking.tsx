
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  FileSearch, 
  FolderInput, 
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Save,
  User,
  CreditCard,
  Building,
  Link as LinkIcon,
  FileText,
  Smartphone,
  Calendar,
  DollarSign,
  Maximize2,
  UploadCloud,
  Download,
  FileSignature,
  Eye,
  Trash2,
  Edit2,
  ArrowUpCircle
} from 'lucide-react';
import { Proposal, ProposalStatus, DocStatus, ProposalDocument, ContractStatus } from '../types';
import { proposalsApi } from '../services/api/proposalsApi';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const StatusTag: React.FC<{ status: ProposalStatus; onClick: () => void }> = ({ status, onClick }) => {
  const styles: Record<string, string> = {
    'Pendente': 'bg-amber-50 text-amber-700 border-amber-200',
    'Em Análise': 'bg-blue-50 text-blue-700 border-blue-200',
    'Em análise documental': 'bg-blue-50 text-blue-700 border-blue-200',
    'Aprovado': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Reprova documental': 'bg-rose-50 text-rose-700 border-rose-100',
    'Reprovado': 'bg-rose-50 text-rose-700 border-rose-100',
    'Assinado': 'bg-emerald-600 text-white border-emerald-700',
    'Faturado': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Cancelada': 'bg-slate-100 text-slate-500 border-slate-200',
    'PEN - Envio Documento': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const currentStyle = styles[status] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-all active:scale-95 ${currentStyle}`}
    >
      {status}
      <ChevronDown size={12} />
    </button>
  );
};

const ProposalsTracking: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUploadProofOpen, setIsUploadProofOpen] = useState(false);
  const [isPreviewProofOpen, setIsPreviewProofOpen] = useState(false);
  
  const [newStatusValue, setNewStatusValue] = useState<ProposalStatus>('Pendente');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editForm, setEditForm] = useState<Proposal | null>(null);

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoadingData(true);
        const rows = await proposalsApi.list();
        setProposals(rows);
      } catch (error) {
        addToast('Erro ao carregar propostas reais do Supabase.', 'error');
      } finally {
        setLoadingData(false);
      }
    };

    loadProposals();
  }, []);

  const filtered = useMemo(() => {
    return proposals.filter(p => 
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientCpf.includes(searchTerm) ||
      p.code.includes(searchTerm) ||
      p.nsu.includes(searchTerm)
    );
  }, [searchTerm, proposals]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / recordsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filtered.slice(start, start + recordsPerPage);
  }, [filtered, currentPage, recordsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, recordsPerPage]);

  const fromItem = filtered.length === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const toItem = Math.min(currentPage * recordsPerPage, filtered.length);

  const openDetails = (p: Proposal) => {
    setSelectedProposal(p);
    setEditForm({ ...p });
    setIsDetailsOpen(true);
  };

  const handleSaveProposal = () => {
    if (!editForm) return;
    setProposals(prev => prev.map(p => p.id === editForm.id ? editForm : p));
    setSelectedProposal(editForm);
    setIsDetailsOpen(false);
    addToast(`Proposta #${editForm.code} atualizada com sucesso!`);
  };

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProposal || !e.target.files?.[0]) return;
    const mockUrl = "https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=800";
    const updatedProposals = proposals.map(p => p.id === selectedProposal.id ? { ...p, paymentProofUrl: mockUrl } : p);
    setProposals(updatedProposals);
    setSelectedProposal({ ...selectedProposal, paymentProofUrl: mockUrl });
    addToast("Comprovante de pagamento enviado com sucesso!");
  };

  const handleRemoveProof = () => {
    if (!selectedProposal) return;
    const updatedProposals = proposals.map(p => p.id === selectedProposal.id ? { ...p, paymentProofUrl: undefined } : p);
    setProposals(updatedProposals);
    setSelectedProposal({ ...selectedProposal, paymentProofUrl: undefined });
    addToast("Comprovante removido.", "warning");
  };

  const handleOpenContract = (p: Proposal) => {
    window.open('https://assina.ae', '_blank');
    if (!p.contractStatus || p.contractStatus === 'Não Gerado') {
        const updated = proposals.map(item => item.id === p.id ? { ...item, contractStatus: 'Aguardando Assinatura' as ContractStatus } : item);
        setProposals(updated);
        addToast("Link de contrato gerado.");
    }
  };

  const statusOptions: ProposalStatus[] = [
    'PEN - Envio Documento', 'Em análise documental', 'Reprova documental', 'Link Pag. Enviado', 
    'Link Pag. Aprovado', 'Link Pag. Reprovado', 'Aguardando formalização', 'Em análise formalização', 
    'Liberar Crédito', 'Crédito Enviado', 'Aguardando Confirmação', 'Cancelada'
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const toProperName = (value?: string) => {
    if (!value) return '-';
    return value
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Camada de Toasts */}
      <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 min-w-[320px] bg-white ${toast.type === 'error' ? 'text-rose-600 border-rose-100' : toast.type === 'warning' ? 'text-amber-600 border-amber-100' : 'text-emerald-600 border-emerald-100'}`}>
            <div className={`p-2 rounded-xl ${toast.type === 'error' ? 'bg-rose-50' : toast.type === 'warning' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              {toast.type === 'error' ? <AlertCircle size={20} /> : toast.type === 'warning' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <p className="text-sm font-bold flex-1 text-slate-700">{toast.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[7px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <select
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                className="h-8 px-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-[7px] text-sm"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span>registros por página</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span>Buscar:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-[220px] px-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-[7px] text-sm outline-none focus:ring-1 ring-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loadingData && (
            <div className="px-6 py-4 text-sm font-semibold text-slate-500">Carregando propostas reais...</div>
          )}
          <table className="w-full text-left whitespace-nowrap text-sm text-slate-700 dark:text-slate-200 font-normal border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-sm font-medium text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                <th className="px-3 py-2.5 border border-slate-300 dark:border-slate-700">COD</th>
                <th className="px-3 py-2.5 border border-slate-300 dark:border-slate-700">CRIAÇÃO</th>
                <th className="px-3 py-2.5 border border-slate-300 dark:border-slate-700">CLIENTE</th>
                <th className="px-3 py-2.5 border border-slate-300 dark:border-slate-700">STATUS</th>
                <th className="px-3 py-2.5 border border-slate-300 dark:border-slate-700 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {!loadingData && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500">Nenhuma proposta encontrada.</td>
                </tr>
              )}
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-sm font-normal">#{p.code}</td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-sm font-normal">{formatDate(p.createdAt)}</td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700"><p className="text-sm font-normal truncate max-w-[260px]">{toProperName(p.clientName)}</p></td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700"><StatusTag status={p.status} onClick={() => { setSelectedProposal(p); setNewStatusValue(p.status); setIsStatusModalOpen(true); }} /></td>
                  <td className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Lupa - Detalhes/Editar */}
                      <button onClick={() => openDetails(p)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all" title="Ver Detalhes"><Search size={18} /></button>
                      {/* Upload Comprovante */}
                      <button onClick={() => { setSelectedProposal(p); setIsUploadProofOpen(true); }} className="p-2 rounded-xl transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-100" title="Upload Comprovante"><UploadCloud size={18} /></button>
                      {/* Download Comprovante */}
                      {p.paymentProofUrl && <a href={p.paymentProofUrl} download className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl" title="Download"><Download size={18} /></a>}
                      {/* Contrato assina.ae */}
                      <button onClick={() => handleOpenContract(p)} className="p-2 rounded-xl transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-100" title="Contrato assina.ae"><FileSignature size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
          <div>Mostrando {fromItem} até {toItem} de {filtered.length} registros</div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-[7px] disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 border rounded-[7px] ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 dark:border-slate-700'}`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-[7px] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Upload/Visualizar Comprovante */}
      {isUploadProofOpen && selectedProposal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
              <div className="p-8 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><UploadCloud size={20} /></div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Comprovante</h3>
                </div>
                <button onClick={() => setIsUploadProofOpen(false)} className="p-2 text-slate-300 hover:text-slate-600 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-10 space-y-8">
                 {selectedProposal.paymentProofUrl ? (
                   <div className="space-y-4">
                      <div className="relative group cursor-pointer overflow-hidden rounded-3xl" onClick={() => setIsPreviewProofOpen(true)}>
                         <img src={selectedProposal.paymentProofUrl} className="w-full h-48 object-cover group-hover:scale-105 transition-all" />
                         <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><Maximize2 className="text-white" size={32} /></div>
                      </div>
                      <div className="flex gap-3">
                         <button onClick={() => setIsPreviewProofOpen(true)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-2"><Eye size={16} /> Ver Maior</button>
                         <button onClick={handleRemoveProof} className="px-6 py-3 text-rose-500 bg-rose-50 rounded-2xl"><Trash2 size={18} /></button>
                      </div>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[32px] p-12 space-y-4 bg-slate-50">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200"><FileText size={32} /></div>
                      <p className="text-sm font-bold text-slate-400">Nenhum comprovante enviado.</p>
                      <label className="cursor-pointer px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">Selecionar Arquivo<input type="file" className="hidden" accept="image/*" onChange={handleUploadProof} /></label>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {isPreviewProofOpen && selectedProposal?.paymentProofUrl && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-sm animate-in fade-in" onClick={() => setIsPreviewProofOpen(false)}>
           <button className="absolute top-8 right-8 p-4 text-white hover:bg-white/10 rounded-full"><X size={32} /></button>
           <img src={selectedProposal.paymentProofUrl} className="max-w-full max-h-full rounded-2xl shadow-2xl animate-in zoom-in-90" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Modal Detalhes e Edição (Lupa) */}
      {isDetailsOpen && editForm && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[48px] w-full max-w-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="px-10 py-8 border-b flex items-center justify-between bg-white dark:bg-slate-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Maximize2 size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Editar Proposta #{editForm.code}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Atualize os campos necessários</p>
                </div>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="p-3 text-slate-300 hover:text-slate-900 rounded-full"><X size={28} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3"><User size={18} className="text-blue-500" /><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Dados do Cliente</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label><input type="text" value={editForm.clientName} onChange={e => setEditForm({...editForm, clientName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-blue-500/20" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CPF</label><input type="text" value={editForm.clientCpf} onChange={e => setEditForm({...editForm, clientCpf: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold outline-none focus:ring-2 ring-blue-500/20" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefone</label><input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-blue-500/20" /></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-3"><CreditCard size={18} className="text-emerald-500" /><h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Condições</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor Bruto</label><input type="number" value={editForm.grossValue} onChange={e => setEditForm({...editForm, grossValue: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor Líquido</label><input type="number" value={editForm.netValue} onChange={e => setEditForm({...editForm, netValue: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-blue-600" /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prazo</label><input type="text" value={editForm.term} onChange={e => setEditForm({...editForm, term: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" /></div>
                </div>
              </div>
            </div>
            <div className="px-10 py-8 border-t flex justify-end gap-4 bg-slate-50/50">
              <button onClick={() => setIsDetailsOpen(false)} className="px-8 py-3.5 text-sm font-black text-slate-400 uppercase tracking-widest">Descartar</button>
              <button onClick={handleSaveProposal} className="px-12 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl flex items-center gap-3"><Save size={20} /> Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Status Rápido */}
      {isStatusModalOpen && selectedProposal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-widest">Alterar Status</h2>
              <button onClick={() => setIsStatusModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Novo Estado</label>
                <div className="relative">
                   <select value={newStatusValue} onChange={(e) => setNewStatusValue(e.target.value as ProposalStatus)} className="w-full bg-slate-50 dark:bg-slate-800 border border-blue-500/30 rounded-2xl px-5 py-4 appearance-none font-black text-sm uppercase tracking-tight">
                     {statusOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" size={18} />
                </div>
              </div>
              <button onClick={() => { setProposals(prev => prev.map(p => p.id === selectedProposal.id ? { ...p, status: newStatusValue } : p)); setIsStatusModalOpen(false); addToast(`Status alterado.`); }} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl active:scale-95 transition-all">Confirmar Alteração</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalsTracking;
