
import React, { useState, useMemo, useEffect } from 'react';
import { mockUsers, mockProfiles, mockCompanies } from '../data/mockData';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Edit2, 
  Trash2, 
  UserCircle,
  AlertTriangle,
  X,
  Info,
  Lock,
  Save,
  Check
} from 'lucide-react';
import { User } from '../types';

// Usuário logado simulado (Ricardo Oliveira - Master da unidade c1)
const currentUser = mockUsers[0];

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'warning';
}

const Users: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Estados para Modais
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  // Estados de Controle
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Estado do Formulário
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    profileId: mockProfiles[0].id,
    isMaster: false,
    status: 'Ativo' as 'Ativo' | 'Inativo'
  });

  // Filtro: Apenas usuários da mesma unidade (companyId) do usuário logado
  const unitUsers = useMemo(() => {
    return usersList.filter(user => 
      user.companyId === currentUser.companyId && (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, usersList]);

  const companyName = mockCompanies.find(c => c.id === currentUser.companyId)?.legalName || 'Unidade Atual';
  const canEdit = currentUser.isMaster || currentUser.profileId === 'p1';

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

  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormState({
        name: user.name,
        email: user.email,
        password: '', // Senha não é carregada por segurança
        profileId: user.profileId,
        isMaster: !!user.isMaster,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormState({
        name: '',
        email: '',
        password: '',
        profileId: mockProfiles[0].id,
        isMaster: false,
        status: 'Ativo'
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Regra: Não pode tirar o Master do único master da unidade
    if (editingUser?.isMaster && !formState.isMaster) {
      const otherMasters = unitUsers.filter(u => u.isMaster && u.id !== editingUser.id);
      if (otherMasters.length === 0) {
        addToast("Ação Bloqueada: A unidade deve possuir pelo menos um usuário Master.", "error");
        return;
      }
    }

    if (editingUser) {
      const updated = usersList.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formState } 
          : u
      );
      setUsersList(updated);
      addToast(`Usuário ${formState.name} atualizado com sucesso!`);
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        ...formState,
        companyId: currentUser.companyId,
      };
      setUsersList([newUser, ...usersList]);
      addToast(`Usuário ${formState.name} criado com sucesso!`);
    }
    
    setIsUserModalOpen(false);
  };

  const initiateDelete = (user: User) => {
    const mastersInUnit = unitUsers.filter(u => u.isMaster);
    if (user.isMaster && mastersInUnit.length <= 1) {
      addToast("Ação Bloqueada: A unidade deve possuir pelo menos um usuário Master.", "error");
      return;
    }
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    setUsersList(prev => prev.filter(u => u.id !== userToDelete.id));
    addToast(`Usuário ${userToDelete.name} removido com sucesso.`);
    setIsConfirmOpen(false);
    setUserToDelete(null);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Usuários da Unidade</h1>
          <p className="text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Building2 size={14} className="text-blue-500" />
            {companyName}
          </p>
        </div>
        {canEdit && (
          <button 
            onClick={() => openUserModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <UserPlus size={20} />
            Novo Usuário
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou e-mail..." 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 ring-blue-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">SITUAÇÃO</th>
                <th className="px-6 py-4">USUÁRIO</th>
                <th className="px-6 py-4">PERFIL DE ACESSO</th>
                <th className="px-6 py-4">TIPO</th>
                <th className="px-6 py-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {unitUsers.map((user) => {
                const profile = mockProfiles.find(p => p.id === user.profileId);
                const isMe = user.id === currentUser.id;
                
                return (
                  <tr key={user.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group ${isMe ? 'bg-blue-50/10 dark:bg-blue-900/10' : ''}`}>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        user.status === 'Ativo' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' 
                          : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800'
                      }`}>
                        {user.status === 'Ativo' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                          <img src={`https://picsum.photos/seed/${user.id}/40/40`} alt="" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                             {isMe && <span className="text-[9px] bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-1.5 py-0.5 rounded uppercase font-black">Você</span>}
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 w-fit">
                        <ShieldCheck size={14} className="text-blue-600" />
                        {profile?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isMaster ? (
                        <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-800">Master</span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Colaborador</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <>
                            <button 
                              onClick={() => openUserModal(user)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" 
                              title="Editar Usuário"
                            >
                              <Edit2 size={16} />
                            </button>
                            {!isMe && (
                              <button 
                                onClick={() => initiateDelete(user)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all" 
                                title="Excluir Usuário"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {unitUsers.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700 shadow-inner">
                <UserCircle className="w-10 h-10 text-slate-200 dark:text-slate-700" />
              </div>
              <p className="text-slate-900 dark:text-white font-bold">Nenhum usuário encontrado</p>
              <p className="text-slate-400 text-sm mt-1">Refine sua busca ou adicione um novo colaborador.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm">
                   {editingUser ? <Edit2 size={24} /> : <UserPlus size={24} />}
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                     {editingUser ? `Editar Usuário: ${editingUser.name}` : 'Novo Usuário para a Unidade'}
                   </h2>
                   <p className="text-xs font-medium text-slate-400">Configure os acessos e informações do colaborador.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">NOME COMPLETO</label>
                  <input 
                    required
                    type="text"
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">E-MAIL</label>
                  <input 
                    required
                    type="email"
                    value={formState.email}
                    onChange={e => setFormState({...formState, email: e.target.value})}
                    placeholder="joao@empresa.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SENHA</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                    <input 
                      type="password"
                      value={formState.password}
                      onChange={e => setFormState({...formState, password: e.target.value})}
                      placeholder={editingUser ? "•••••••• (Vazio para manter)" : "Defina uma senha"}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-12 pr-5 py-4 focus:ring-2 ring-indigo-500 transition-all outline-none font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">PERFIL DE ACESSO</label>
                  <select 
                    value={formState.profileId}
                    onChange={e => setFormState({...formState, profileId: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl px-5 py-4 focus:ring-2 ring-indigo-500 transition-all outline-none appearance-none text-slate-900 dark:text-white"
                  >
                    {mockProfiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                <div className="flex items-center gap-6">
                  <div 
                    onClick={() => setFormState({...formState, isMaster: !formState.isMaster})}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                      formState.isMaster ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group-hover:border-indigo-300'
                    }`}>
                      {formState.isMaster && <Check size={14} strokeWidth={4} />}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Usuário Master</span>
                  </div>

                  <div 
                    onClick={() => setFormState({...formState, status: formState.status === 'Ativo' ? 'Inativo' : 'Ativo'})}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                      formState.status === 'Ativo' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 group-hover:border-emerald-300'
                    }`}>
                      {formState.status === 'Ativo' && <Check size={14} strokeWidth={4} />}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Ativo no Sistema</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-8 py-4 text-sm font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none uppercase tracking-widest"
                  >
                    <Save size={18} />
                    {editingUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {isConfirmOpen && userToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-rose-100 dark:border-rose-800">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Confirmar Exclusão</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
                Você está prestes a remover o acesso de <span className="font-bold text-slate-900 dark:text-white">{userToDelete.name}</span>. 
                Esta ação revogará imediatamente todas as permissões de acesso deste usuário à plataforma.
              </p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-4">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl transition-all uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 text-sm font-black bg-rose-600 text-white rounded-3xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 dark:shadow-none uppercase tracking-widest"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
