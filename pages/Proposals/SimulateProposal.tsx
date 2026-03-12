
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  ChevronRight, 
  CheckCircle2, 
  DollarSign, 
  CreditCard, 
  Layers, 
  Building2,
  X,
  Target,
  ArrowRight,
  User,
  MapPin,
  Phone,
  Wallet,
  Info,
  ArrowLeft,
  Banknote,
  Hash,
  FileText,
  Send,
  ClipboardCheck,
  Building
} from 'lucide-react';

interface InstallmentRow {
  number: number;
  totalToPay: number; // Base reference (e.g., 1258.80 for 1000 released)
  isActive: boolean;
}

interface CommissionTable {
  id: number;
  tableName: string;
  acquirer: string;
  installments: InstallmentRow[];
}

const SimulateProposal: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [acquirer, setAcquirer] = useState('');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [mode, setMode] = useState<'LIQUIDO' | 'LIMITE'>('LIQUIDO');
  
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<{
    released: number;
    installment: number;
    term: string;
    limit: number;
  } | null>(null);

  // Form Step 2 state
  const [clientForm, setClientForm] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    rg: '',
    ssp: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    uf: '',
    email: '',
    phone: '',
    bank: '',
    agency: '',
    account: '',
    pixType: '',
    pixKey: ''
  });

  const [isRegistering, setIsRegistering] = useState(false);

  // Mocked tables updated with requested Fintechs
  const [tables] = useState<CommissionTable[]>([
    { 
      id: 1, 
      tableName: 'Flex 6 Verde', 
      acquirer: 'Icashcard', 
      installments: [
        { number: 2, totalToPay: 1170.00, isActive: true },
        { number: 6, totalToPay: 1210.00, isActive: true },
        { number: 12, totalToPay: 1354.80, isActive: true }
      ] 
    },
    { 
      id: 2, 
      tableName: 'Premium Gold', 
      acquirer: 'Icard', 
      installments: [
        { number: 12, totalToPay: 1280.00, isActive: true },
        { number: 24, totalToPay: 1550.00, isActive: true }
      ] 
    },
    { 
      id: 3, 
      tableName: 'PWG Exclusive', 
      acquirer: 'PWG', 
      installments: [
        { number: 12, totalToPay: 1320.00, isActive: true },
        { number: 18, totalToPay: 1480.00, isActive: true }
      ] 
    }
  ]);

  const filteredTables = tables.filter(t => !acquirer || t.acquirer === acquirer);
  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleCalculate = () => {
    if (!selectedTableId || !inputValue) return;
    setIsOptionsModalOpen(true);
  };

  const selectOption = (inst: InstallmentRow) => {
    const val = parseFloat(inputValue);
    const factor = inst.totalToPay / 1000;
    
    let released, limit, installment;

    if (mode === 'LIQUIDO') {
      released = val;
      limit = val * factor;
      installment = limit / inst.number;
    } else {
      limit = val;
      released = val / factor;
      installment = limit / inst.number;
    }

    setSelectedResult({
      released,
      limit,
      installment,
      term: `${inst.number}x`
    });
    setIsOptionsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const updateClientForm = (field: string, value: string) => {
    setClientForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalize = async () => {
    setIsRegistering(true);
    
    // Simular registro de proposta
    const newProposal = {
      id: Date.now().toString(),
      code: Math.floor(1000 + Math.random() * 9000).toString(),
      nsu: 'NSU' + Math.floor(100000 + Math.random() * 900000).toString(),
      product: 'Crédito Consignado', // Default ou vindo da tabela
      corban: 'Nexus Finanças',
      digitador: 'Juliana Costa',
      createdAt: new Date().toISOString(),
      clientName: clientForm.name,
      clientCpf: clientForm.cpf,
      status: 'PEN - Envio Documento',
      rg: clientForm.rg,
      birthDate: clientForm.birthDate,
      email: clientForm.email,
      address: `${clientForm.street}, ${clientForm.number} - ${clientForm.neighborhood}, ${clientForm.city} - ${clientForm.uf}`,
      phone: clientForm.phone,
      table: selectedTable?.tableName || '',
      term: selectedResult?.term || '',
      grossValue: selectedResult?.limit || 0,
      netValue: selectedResult?.released || 0,
      installmentValue: selectedResult?.installment || 0,
      bank: clientForm.bank,
      agency: clientForm.agency,
      account: clientForm.account,
      pixKey: clientForm.pixKey,
      pixType: clientForm.pixType,
      documents: []
    };

    // Pegar banco existente ou iniciar array
    const saved = localStorage.getItem('nexus_proposals_db');
    const db = saved ? JSON.parse(saved) : [];
    localStorage.setItem('nexus_proposals_db', JSON.stringify([newProposal, ...db]));

    // Delay para simular rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRegistering(false);
    navigate('/proposals/tracking');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Simular | Digitar</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Inicie uma nova proposta de crédito em 3 passos simples.</p>
        </div>
        
        {/* Stepper UI */}
        <div className="flex items-center gap-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${
                  step === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 
                  step > i ? 'bg-emerald-50 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}>
                  {step > i ? <CheckCircle2 size={20} /> : i}
                </div>
                {i < 3 && <div className={`w-8 h-1 rounded-full ${step > i ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`} />}
             </div>
           ))}
        </div>
      </div>

      {/* Step 1: Simulation */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Fintech</label>
                 <select 
                   value={acquirer} 
                   onChange={e => setAcquirer(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-blue-500/20 text-slate-900 dark:text-white font-bold appearance-none"
                 >
                   <option value="">Selecione...</option>
                   <option value="Icashcard">Icashcard</option>
                   <option value="Icard">Icard</option>
                   <option value="PWG">PWG</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Tabela de Comissões</label>
                 <select 
                   value={selectedTableId || ''} 
                   onChange={e => setSelectedTableId(Number(e.target.value))}
                   className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl px-6 py-4 outline-none focus:ring-2 ring-blue-500/20 text-slate-900 dark:text-white font-bold appearance-none"
                 >
                   <option value="">Selecione...</option>
                   {filteredTables.map(t => <option key={t.id} value={t.id}>{t.tableName}</option>)}
                 </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Valor do Lançamento</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <span className="font-black text-sm">R$</span>
                </div>
                <input 
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] pl-14 pr-8 py-5 outline-none focus:ring-2 ring-blue-500/20 text-xl font-black text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">O Valor informado é:</label>
              <div className="flex gap-4">
                 <button 
                   onClick={() => setMode('LIQUIDO')}
                   className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border-2 ${
                     mode === 'LIQUIDO' ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-100' : 'bg-transparent border-slate-100 text-slate-400 hover:bg-slate-50'
                   }`}
                 >
                   Líquido
                 </button>
                 <button 
                   onClick={() => setMode('LIMITE')}
                   className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border-2 ${
                     mode === 'LIMITE' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100' : 'bg-transparent border-slate-100 text-slate-400 hover:bg-slate-50'
                   }`}
                 >
                   Limite
                 </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
               <button 
                 onClick={handleCalculate}
                 className="w-full py-5 bg-emerald-500 text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-[0.98]"
               >
                 Calcular Opções
               </button>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 space-y-10">
                <div className="flex items-center gap-3">
                   <Target size={20} className="text-blue-500" />
                   <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Resumo da Simulação</h3>
                </div>

                <div className="space-y-8">
                   <div className="flex items-start justify-between group">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Liberado:</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedResult ? formatCurrency(selectedResult.released) : 'R$ -'}</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl"><DollarSign size={20} /></div>
                   </div>

                   <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Parcela:</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedResult ? formatCurrency(selectedResult.installment) : 'R$ -'}</p>
                      </div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl"><Layers size={20} /></div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Prazo:</p>
                         <p className="text-lg font-black text-blue-600 uppercase">{selectedResult ? selectedResult.term : '-'}</p>
                      </div>
                      <div className="p-6 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Limite Utilizado:</p>
                         <p className="text-lg font-black text-slate-900 dark:text-white">{selectedResult ? formatCurrency(selectedResult.limit) : 'R$ -'}</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={!selectedResult}
                    onClick={() => setStep(2)}
                    className="w-full py-5 bg-slate-900 text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    Próxima Etapa <ArrowRight size={20} />
                  </button>
                </div>
             </div>

             <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start">
                <Calculator size={24} className="text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                  Os valores exibidos são baseados nas taxas atuais da tabela selecionada. O limite real pode variar de acordo com o saldo disponível no cartão do cliente.
                </p>
             </div>
          </div>
        </div>
      )}

      {/* Step 2: Client Data & PIX */}
      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center"><User size={20} /></div>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Dados Pessoais</h3>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
                  <input type="text" value={clientForm.name} onChange={e => updateClientForm('name', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Nome completo do cliente" />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CPF</label>
                  <input type="text" value={clientForm.cpf} onChange={e => updateClientForm('cpf', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-mono font-bold dark:text-white" placeholder="000.000.000-00" />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data de Nascimento</label>
                  <input type="date" value={clientForm.birthDate} onChange={e => updateClientForm('birthDate', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">RG</label>
                  <input type="text" value={clientForm.rg} onChange={e => updateClientForm('rg', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Número do RG" />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SSP / UF</label>
                  <input type="text" value={clientForm.ssp} onChange={e => updateClientForm('ssp', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Ex: SSP/MT" />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                   <MapPin size={16} className="text-emerald-500" />
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Endereço de Residência</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CEP</label>
                    <input type="text" value={clientForm.cep} onChange={e => updateClientForm('cep', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="00000-000" />
                  </div>
                  <div className="md:col-span-7 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rua / Av.</label>
                    <input type="text" value={clientForm.street} onChange={e => updateClientForm('street', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Nome da rua" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nº</label>
                    <input type="text" value={clientForm.number} onChange={e => updateClientForm('number', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="S/N" />
                  </div>
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Setor / Bairro</label>
                    <input type="text" value={clientForm.neighborhood} onChange={e => updateClientForm('neighborhood', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Bairro" />
                  </div>
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cidade</label>
                    <input type="text" value={clientForm.city} onChange={e => updateClientForm('city', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Cidade" />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">UF</label>
                    <input type="text" value={clientForm.uf} onChange={e => updateClientForm('uf', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="UF" />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                   <Phone size={16} className="text-blue-500" />
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Informações de Contato</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">E-mail</label>
                    <input type="email" value={clientForm.email} onChange={e => updateClientForm('email', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="email@exemplo.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Telefone / Whatsapp</label>
                    <input type="text" value={clientForm.phone} onChange={e => updateClientForm('phone', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="(00) 0 0000-0000" />
                  </div>
                </div>
              </div>
            </div>

            {/* PIX SECTION */}
            <div className="px-10 py-8 border-y border-slate-100 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10 flex items-center gap-4">
               <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center"><Wallet size={20} /></div>
               <h3 className="text-sm font-black text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">Dados do PIX para Recebimento</h3>
            </div>

            <div className="p-10 space-y-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-4">
                 <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-lg flex items-center justify-center shrink-0 animate-pulse">
                    <Info size={16} />
                 </div>
                 <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase tracking-tight">Informe os dados bancários e a chave PIX correspondente à institution informada para garantir o crédito.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Banco</label>
                  <select value={clientForm.bank} onChange={e => updateClientForm('bank', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold appearance-none dark:text-white">
                    <option value="">Selecione o banco...</option>
                    <option value="406">406 - ACCREDITO SCD S.A.</option>
                    <option value="260">260 - NUBANK</option>
                    <option value="001">001 - BANCO DO BRASIL</option>
                    <option value="341">341 - ITAÚ UNIBANCO</option>
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Agência</label>
                  <input type="text" value={clientForm.agency} onChange={e => updateClientForm('agency', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Ex: 0001" />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Conta</label>
                  <input type="text" value={clientForm.account} onChange={e => updateClientForm('account', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Ex: 123456-7" />
                </div>
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Chave PIX</label>
                  <select value={clientForm.pixType} onChange={e => updateClientForm('pixType', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold appearance-none dark:text-white">
                    <option value="">Selecione...</option>
                    <option value="CPF">CPF</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="PHONE">Telefone</option>
                    <option value="EVP">Chave Aleatória</option>
                  </select>
                </div>
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Chave PIX</label>
                  <input type="text" value={clientForm.pixKey} onChange={e => updateClientForm('pixKey', e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 ring-blue-500/20 font-bold dark:text-white" placeholder="Digite sua chave PIX" />
                </div>
              </div>
            </div>

            {/* Ações Passo 2 */}
            <div className="px-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <button 
                 onClick={() => setStep(1)}
                 className="flex items-center gap-2 px-8 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all group"
               >
                 <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar Simulação
               </button>
               <button 
                 onClick={() => setStep(3)}
                 className="flex items-center gap-2 px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-100 active:scale-95 transition-all"
               >
                 Próximo Passo <ChevronRight size={18} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review Summary */}
      {step === 3 && (
        <div className="animate-in zoom-in-95 duration-500 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <ClipboardCheck size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Resumo da Solicitação</h2>
                    <p className="text-sm font-medium text-slate-400">Confira todos os dados antes de registrar a proposta no sistema.</p>
                 </div>
              </div>

              <div className="p-10 space-y-12">
                 {/* Seção Dados Pessoais */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1 h-4 bg-blue-600 rounded-full" />
                       <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">Dados Pessoais</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Cliente:</span>
                          <span className="font-black text-slate-900 dark:text-white uppercase">{clientForm.name || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">CPF:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{clientForm.cpf || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">RG:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{clientForm.rg || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Data Nascimento:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{clientForm.birthDate || '-'}</span>
                       </div>
                       <div className="md:col-span-2 flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Endereço:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                             {clientForm.street ? `${clientForm.street}, ${clientForm.number} - ${clientForm.neighborhood}, ${clientForm.city} - ${clientForm.uf}` : '-'}
                          </span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">CEP:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{clientForm.cep || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">E-mail:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 italic">{clientForm.email || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{clientForm.phone || '-'}</span>
                       </div>
                    </div>
                 </div>

                 {/* Seção Dados da Proposta */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1 h-4 bg-blue-600 rounded-full" />
                       <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">Dados da Proposta</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Fintech:</span>
                          <span className="font-black text-slate-900 dark:text-white uppercase">{acquirer || 'Icashcard'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Tabela:</span>
                          <span className="font-black text-slate-900 dark:text-white uppercase">{selectedTable?.tableName || 'PADRÃO'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Prazo:</span>
                          <span className="font-black text-blue-600 uppercase">{selectedResult?.term || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Valor Bruto:</span>
                          <span className="font-black text-slate-900 dark:text-white">{selectedResult ? formatCurrency(selectedResult.limit) : '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Valor Líquido:</span>
                          <span className="font-black text-emerald-600">{selectedResult ? formatCurrency(selectedResult.released) : '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Valor Parcela:</span>
                          <span className="font-black text-slate-900 dark:text-white">{selectedResult ? formatCurrency(selectedResult.installment) : '-'}</span>
                       </div>
                    </div>
                 </div>

                 {/* Seção Dados Para Pagamento */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <div className="w-1 h-4 bg-blue-600 rounded-full" />
                       <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">Dados Para Pagamento</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Banco:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{clientForm.bank || '406 - ACCREDITO SCD S.A.'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Agência:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{clientForm.agency || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Conta:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{clientForm.account || '-'}</span>
                       </div>
                       <div className="flex items-baseline gap-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{clientForm.pixType || 'Selecione'}</span>
                       </div>
                       <div className="md:col-span-2 flex items-baseline gap-2">
                          <span className="font-bold text-slate-400 whitespace-nowrap">Chave PIX:</span>
                          <span className="font-black text-slate-900 dark:text-white font-mono break-all">{clientForm.pixKey || '-'}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="px-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <button 
                   onClick={() => setStep(2)}
                   disabled={isRegistering}
                   className="flex items-center gap-2 px-10 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all disabled:opacity-50"
                 >
                   <ArrowLeft size={20} /> Voltar Dados
                 </button>
                 <button 
                   onClick={handleFinalize}
                   disabled={isRegistering}
                   className="flex items-center gap-3 px-12 py-5 bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.1em] hover:bg-emerald-600 shadow-2xl shadow-emerald-200 active:scale-95 transition-all disabled:opacity-70 disabled:grayscale"
                 >
                    {isRegistering ? (
                       <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                       <Send size={20} />
                    )}
                    {isRegistering ? 'Registrando Proposta...' : 'Finalizar e Registrar'}
                 </button>
              </div>
           </div>

           <div className="max-w-4xl mx-auto p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-4">
              <Info size={24} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed italic">
                 "Ao finalizar, a proposta entrará automaticamente no pipeline de conferência documental. O cliente receberá as instruções de formalização no e-mail informado."
              </p>
           </div>
        </div>
      )}

      {/* Modal Selection (Refined Header) */}
      {isOptionsModalOpen && selectedTable && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-900 rounded-[48px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
              {/* Header with Title left and Green Tag right */}
              <div className="py-2 px-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <Layers size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">Opções Disponíveis</h3>
                 </div>

                 <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Valor Solicitado</span>
                       <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-xl shadow-sm">
                          <span className="text-xs font-black text-emerald-600">{formatCurrency(parseFloat(inputValue))}</span>
                       </div>
                    </div>
                    <button onClick={() => setIsOptionsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                       <X size={20} />
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                 <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-[32px]">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="px-6 py-2">Ação</th>
                           <th className="px-6 py-2 text-center">Prazo</th>
                           <th className="px-8 py-2 text-right">Valor Receber R$</th>
                           <th className="px-8 py-2 text-right">Valor Parcela R$</th>
                           <th className="px-8 py-2 text-right">Valor Total R$</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {selectedTable.installments.filter(i => i.isActive).map((inst) => {
                           const val = parseFloat(inputValue);
                           const factor = inst.totalToPay / 1000;
                           let released, limit, installment;
                           
                           if (mode === 'LIQUIDO') {
                             released = val;
                             limit = val * factor;
                             installment = limit / inst.number;
                           } else {
                             limit = val;
                             released = val / factor;
                             installment = limit / inst.number;
                           }

                           return (
                             <tr key={inst.number} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                               <td className="px-6 py-1.5">
                                  <button 
                                    onClick={() => selectOption(inst)}
                                    className="text-emerald-600 hover:text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:underline transition-all"
                                  >
                                    Selecionar
                                  </button>
                               </td>
                               <td className="px-6 py-1.5 text-center text-xs font-bold text-slate-900 dark:text-white">em {inst.number}x</td>
                               <td className="px-8 py-1.5 text-right text-xs font-black text-emerald-600">{released.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                               <td className="px-8 py-1.5 text-right text-xs font-black text-slate-900 dark:text-white">{installment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                               <td className="px-8 py-1.5 text-right text-xs font-bold text-slate-700 dark:text-slate-300">{limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                             </tr>
                           );
                         })}
                      </tbody>
                   </table>
                 </div>
              </div>

              <div className="py-3 px-10 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                 <button 
                   onClick={() => setIsOptionsModalOpen(false)}
                   className="px-10 py-1.5 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                 >
                   Cancelar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SimulateProposal;
