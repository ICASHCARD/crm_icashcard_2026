
import React, { useState, useMemo } from 'react';
import { mockCompanies, mockUsers, mockProfiles } from '../data/mockData';
import { 
  Search, 
  Plus, 
  Download, 
  MoreVertical, 
  Building2, 
  CheckCircle, 
  XCircle, 
  X, 
  Users, 
  ShieldCheck, 
  Mail, 
  UserPlus, 
  Trash2, 
  Lock, 
  Edit2, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Company, User } from '../types';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modals state
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  // Current company for user management
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [newCompany, setNewCompany] = useState({
    legalName: '',
    taxId: '',
    adminName: '',
    adminEmail: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    profileId: mockProfiles[0]?.id || '',
    isMaster: false
  });

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      c.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.taxId.includes(searchTerm) ||
      c.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, companies]);

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = `c${companies.length + 1}`;
    
    const company: Company = {
      id: companyId,
      status: 'Ativo',
      taxId: newCompany.taxId,
      legalName: newCompany.legalName,
      adminName: newCompany.adminName,
      userCount: 1,
      inclusionDate: new Date().toISOString().split('T')[0]
    };

    const masterUser: User = {
      id: `u${users.length + 1}`,
      name: newCompany.adminName,
      email: newCompany.adminEmail,
      profileId: 'p1',
      companyId: companyId,
      status: 'Ativo',
      isMaster: true
    };

    setCompanies([company, ...companies]);
    setUsers([...users, masterUser]);
    setIsNewCompanyModalOpen(false);
    setNewCompany({ legalName: '', taxId: '', adminName: '', adminEmail: '' });
    addToast("Unidade e Usuário Master criados com sucesso.");
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;

    if (editingUser) {
      // Update logic
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: userForm.name, email: userForm.email, profileId: userForm.profileId, isMaster: userForm.isMaster } 
          : u
      );
      setUsers(updatedUsers);
      addToast(`Usuário ${userForm.name} atualizado com sucesso.`);
      setEditingUser(null);
    } else {
      // Create logic
      const user: User = {
        id: `u${users.length + 1}`,
        name: userForm.name,
        email: userForm.email,
        profileId: userForm.profileId,
        companyId: activeCompany.id,
        status: 'Ativo',
        isMaster: userForm.isMaster
      };
      setUsers([...users, user]);
      setCompanies(companies.map(c => 
        c.id === activeCompany.id ? { ...c, userCount: c.userCount + 1 } : c
      ));
      addToast(`Usuário ${userForm.name} adicionado com sucesso.`);
    }

    setUserForm({ name: '', email: '', password: '', profileId: mockProfiles[0]?.id || '', isMaster: false });
  };

  const startEditingUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '', // Senha vazia por segurança na edição
      profileId: user.profileId,
      isMaster: !!user.isMaster
    });
  };

  const initiateDeleteUser = (user: User) => {
    const unitMasters = users.filter(u => u.companyId === activeCompany?.id && u.isMaster);
    
    if (user.isMaster && unitMasters.length <= 1) {
      addToast("Ação Bloqueada: A unidade deve possuir pelo menos um usuário Master.", "error");
      return;
    }

    setUserToDelete(user);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete || !activeCompany) return;
    
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setCompanies(companies.map(c => 
      c.id === activeCompany.id ? { ...c, userCount: Math.max(0, c.userCount - 1) } : c
    ));
    
    addToast(`Usuário ${userToDelete.name} removido com sucesso.`);
    setIsConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  const openUsersModal = (company: Company) => {
    setActiveCompany(company);
    setIsUsersModalOpen(true);
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', profileId: mockProfiles[0]?.id || '', isMaster: false });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast Notification Layer */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300 min-w-[320px] ${
              toast.type === 'error' ? 'bg-white text-rose-600 border-rose-100' : 
              toast.type === 'warning' ? 'bg-white text-amber-600 border-amber-100' :
              'bg-white text-emerald-600 border-emerald-100'
            }`}
          >
            <div className={`p-2 rounded-xl ${
              toast.type === 'error' ? 'bg-rose-50' : 
              toast.type === 'warning' ? 'bg-amber-50' :
              'bg-emerald-50'
            }`}>
              {toast.type === 'error' && <XCircle size={20} />}
              {toast.type === 'warning' && <AlertTriangle size={20} />}
              {toast.type === 'success' && <CheckCircle2 size={20} />}
            </div>
            <p className="text-sm font-bold flex-1 text-slate-700">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Unidades & Empresas</h1>
          <p className="text-slate-500">Gerencie as entidades e seus respectivos usuários mestres.</p>
        </div>
        <button 
          onClick={() => setIsNewCompanyModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Nova Unidade
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
              placeholder="Pesquisar por razão social, CNPJ ou administrador..." 
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={14} />
              Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">SITUAÇÃO</th>
                <th className="px-6 py-4">CNPJ</th>
                <th className="px-6 py-4">RAZÃO SOCIAL</th>
                <th className="px-6 py-4">ADMIN MESTRE</th>
                <th className="px-6 py-4 text-center">USUÁRIOS</th>
                <th className="px-6 py-4">INCLUSÃO</th>
                <th className="px-6 py-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      company.status === 'Ativo' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {company.status === 'Ativo' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {company.taxId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{company.legalName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{company.adminName}</span>
                      <span className="text-[10px] text-slate-400">Usuário Master</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => openUsersModal(company)}
                      className="group flex flex-col items-center mx-auto"
                    >
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded group-hover:bg-blue-100 transition-colors">
                        {company.userCount}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(company.inclusionDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openUsersModal(company)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Gerenciar Usuários"
                      >
                        <Users size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCompanies.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">Nenhuma unidade encontrada.</div>
          )}
        </div>
      </div>

      {/* Modal Manage Users (Matches Screenshot) */}
      {isUsersModalOpen && activeCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-5xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 max-h-[92vh] flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Users size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Usuários: {activeCompany.legalName}</h2>
                  <p className="text-sm font-medium text-slate-400">Gerencie quem tem acesso a esta unidade.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUsersModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Form Column */}
              <div className="lg:col-span-4 space-y-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <UserPlus size={18} />
                  {editingUser ? 'EDITAR USUÁRIO' : 'NOVO USUÁRIO'}
                </h3>
                <form onSubmit={handleUserSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">NOME COMPLETO</label>
                    <input 
                      required
                      type="text"
                      value={userForm.name}
                      onChange={e => setUserForm({...userForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-sm rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:ring-2 ring-indigo-500 transition-all outline-none"
                      placeholder="Nome do usuário"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">E-MAIL</label>
                    <input 
                      required
                      type="email"
                      value={userForm.email}
                      onChange={e => setUserForm({...userForm, email: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-sm rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:ring-2 ring-indigo-500 transition-all outline-none"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">SENHA</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                      <input 
                        type="password"
                        value={userForm.password}
                        onChange={e => setUserForm({...userForm, password: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-sm rounded-2xl pl-11 pr-5 py-4 text-slate-900 placeholder-slate-400 focus:ring-2 ring-indigo-500 transition-all outline-none font-mono"
                        placeholder={editingUser ? "•••••••• (deixe em branco para manter)" : "Defina uma senha"}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">PERFIL DE ACESSO</label>
                    <select 
                      value={userForm.profileId}
                      onChange={e => setUserForm({...userForm, profileId: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-sm rounded-2xl px-5 py-4 text-slate-900 appearance-none focus:ring-2 ring-indigo-500 transition-all outline-none"
                    >
                      {mockProfiles.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <div 
                      onClick={() => setUserForm({...userForm, isMaster: !userForm.isMaster})}
                      className={`w-5 h-5 rounded border transition-all flex items-center justify-center cursor-pointer ${
                        userForm.isMaster ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {userForm.isMaster && <CheckCircle size={14} />}
                    </div>
                    <label 
                      onClick={() => setUserForm({...userForm, isMaster: !userForm.isMaster})}
                      className="text-sm font-bold text-slate-700 cursor-pointer select-none"
                    >
                      Usuário Master
                    </label>
                  </div>
                  <div className="flex gap-3">
                    {editingUser && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setUserForm({ name: '', email: '', password: '', profileId: mockProfiles[0]?.id || '', isMaster: false });
                        }}
                        className="px-4 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
                    >
                      {editingUser ? 'Atualizar Dados' : 'Adicionar Usuário'}
                    </button>
                  </div>
                </form>
              </div>

              {/* List Column */}
              <div className="lg:col-span-8 space-y-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">ACESSOS ATIVOS</h3>
                <div className="space-y-4">
                  {users.filter(u => u.companyId === activeCompany.id).map(u => {
                    const profile = mockProfiles.find(p => p.id === u.profileId);
                    return (
                      <div key={u.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black text-lg shadow-sm border ${
                            u.isMaster ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {u.name.substring(0, 1)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-black text-slate-900 text-base">{u.name}</h4>
                              {u.isMaster && (
                                <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">MASTER</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs font-bold text-slate-400">
                              <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-300" /> {u.email}</span>
                              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-slate-300" /> {profile?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => startEditingUser(u)}
                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                            title="Editar Dados"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button 
                            onClick={() => initiateDeleteUser(u)}
                            className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                            title="Remover Acesso"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {users.filter(u => u.companyId === activeCompany.id).length === 0 && (
                    <div className="p-16 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                      <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">Nenhum usuário nesta unidade.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsUsersModalOpen(false)}
                className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmDeleteOpen && userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-rose-100">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Confirmar Exclusão</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                O acesso de <span className="font-bold text-slate-900">{userToDelete.name}</span> será revogado permanentemente desta unidade.
              </p>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-3xl transition-all uppercase tracking-widest"
              >
                Manter
              </button>
              <button 
                onClick={confirmDeleteUser}
                className="flex-1 py-4 text-sm font-black bg-rose-600 text-white rounded-3xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 uppercase tracking-widest"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
