
import React, { useState, useEffect } from 'react';
import { mockProfiles } from '../data/mockData';
import { Shield, Plus, MoreVertical, Users, Check, X, Info, Trash2, AlertTriangle, Save } from 'lucide-react';
import { Profile, PermissionLevel, ResourcePermissions } from '../types';

const PermissionToggle: React.FC<{ 
  active: boolean; 
  onClick: () => void;
  disabled?: boolean;
}> = ({ active, onClick, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
      active 
        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
        : 'bg-slate-50 text-slate-300 border-slate-200 hover:border-slate-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {active ? <Check size={16} /> : <X size={16} />}
  </button>
);

const ViewLevelBadge: React.FC<{ 
  level: PermissionLevel; 
  onClick: () => void;
}> = ({ level, onClick }) => {
  const styles = {
    'All': 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
    'Own': 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100',
    'None': 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100',
  };

  const labels = {
    'All': 'Tudo',
    'Own': 'Próprios',
    'None': 'Nenhum',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all uppercase tracking-tight ${styles[level]}`}
    >
      Ver: {labels[level]}
    </button>
  );
};

const Profiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(profiles[0].id);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({ name: '', description: '' });
  const [isDirty, setIsDirty] = useState(false);

  // Sincroniza o perfil em edição quando a seleção muda
  useEffect(() => {
    const profile = profiles.find(p => p.id === selectedProfileId);
    if (profile) {
      setEditingProfile(JSON.parse(JSON.stringify(profile))); // Deep clone
      setIsDirty(false);
    }
  }, [selectedProfileId, profiles]);

  const handleToggle = (resource: string, action: keyof ResourcePermissions['actions']) => {
    if (!editingProfile) return;

    const updatedPermissions = editingProfile.permissions.map(perm => {
      if (perm.resource === resource) {
        if (action === 'view') {
          const levels: PermissionLevel[] = ['None', 'Own', 'All'];
          const currentIndex = levels.indexOf(perm.actions.view as PermissionLevel);
          const nextIndex = (currentIndex + 1) % levels.length;
          return { ...perm, actions: { ...perm.actions, view: levels[nextIndex] } };
        } else {
          return { ...perm, actions: { ...perm.actions, [action]: !perm.actions[action] } };
        }
      }
      return perm;
    });

    setEditingProfile({ ...editingProfile, permissions: updatedPermissions });
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!editingProfile) return;
    const updatedProfiles = profiles.map(p => p.id === editingProfile.id ? editingProfile : p);
    setProfiles(updatedProfiles);
    setIsDirty(false);
    // Simular feedback
    alert(`Perfil "${editingProfile.name}" atualizado com sucesso!`);
  };

  const handleDelete = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    
    if (profile.userCount > 0) {
      alert("Não é possível excluir um perfil que possui usuários vinculados.");
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o perfil "${profile.name}"?`)) {
      const updated = profiles.filter(p => p.id !== id);
      setProfiles(updated);
      if (selectedProfileId === id) {
        setSelectedProfileId(updated[0]?.id || null);
      }
    }
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `p${Date.now()}`;
    const profile: Profile = {
      id,
      name: newProfile.name,
      description: newProfile.description,
      userCount: 0,
      permissions: [
        { resource: 'sales', label: 'Vendas', actions: { view: 'Own', edit: false, delete: false, create: true } },
        { resource: 'finance', label: 'Financeiro', actions: { view: 'Own', edit: false, delete: false, create: false } },
        { resource: 'clients', label: 'Clientes', actions: { view: 'Own', edit: true, delete: false, create: true } },
        { resource: 'companies', label: 'Empresas', actions: { view: 'None', edit: false, delete: false, create: false } },
      ]
    };
    setProfiles([...profiles, profile]);
    setSelectedProfileId(id);
    setIsModalOpen(false);
    setNewProfile({ name: '', description: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Perfis de Acesso</h1>
          <p className="text-slate-500">Defina níveis de permissão para os usuários da organização.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Novo Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile List */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Perfis Cadastrados</h3>
          <div className="space-y-3">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all relative group ${
                  selectedProfileId === profile.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${selectedProfileId === profile.id ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                    <Shield size={18} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${selectedProfileId === profile.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    <Users size={12} />
                    {profile.userCount} usuários
                  </div>
                </div>
                <h4 className="font-bold text-sm mb-1">{profile.name}</h4>
                <p className={`text-xs leading-relaxed line-clamp-2 ${selectedProfileId === profile.id ? 'text-blue-50' : 'text-slate-400'}`}>
                  {profile.description}
                </p>
                
                {profile.userCount === 0 && selectedProfileId !== profile.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}
                    className="absolute top-2 right-2 p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Permission Details */}
        <div className="lg:col-span-2 space-y-6">
          {editingProfile ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300 flex flex-col h-fit">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{editingProfile.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{editingProfile.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {isDirty && (
                     <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-full animate-pulse border border-amber-100 uppercase tracking-widest">Alterações Pendentes</span>
                   )}
                   <button 
                    onClick={() => handleDelete(editingProfile.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Excluir Perfil"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-start gap-4 mb-8 p-4 bg-blue-50 text-blue-700 rounded-2xl text-xs border border-blue-100">
                  <div className="mt-0.5"><Info size={18} /></div>
                  <div className="space-y-1">
                    <p className="font-bold">Regras de Negócio:</p>
                    <p className="opacity-80">Alterações aqui impactam {editingProfile.userCount} usuário(s) ativos vinculados a este perfil. O nível de visualização define se o usuário vê apenas o que ele criou ou todos os dados da unidade.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="pb-4 px-2">Recurso / Módulo</th>
                        <th className="pb-4 px-2">Visualização</th>
                        <th className="pb-4 px-2 text-center">Criar</th>
                        <th className="pb-4 px-2 text-center">Editar</th>
                        <th className="pb-4 px-2 text-center">Excluir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {editingProfile.permissions.map((perm) => (
                        <tr key={perm.resource} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-2">
                            <span className="text-sm font-bold text-slate-700">{perm.label}</span>
                          </td>
                          <td className="py-4 px-2">
                            <ViewLevelBadge 
                              level={perm.actions.view as PermissionLevel} 
                              onClick={() => handleToggle(perm.resource, 'view')}
                            />
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex justify-center">
                              <PermissionToggle 
                                active={perm.actions.create} 
                                onClick={() => handleToggle(perm.resource, 'create')}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex justify-center">
                              <PermissionToggle 
                                active={perm.actions.edit} 
                                onClick={() => handleToggle(perm.resource, 'edit')}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex justify-center">
                              <PermissionToggle 
                                active={perm.actions.delete} 
                                onClick={() => handleToggle(perm.resource, 'delete')}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    disabled={!isDirty}
                    onClick={() => setEditingProfile(JSON.parse(JSON.stringify(profiles.find(p => p.id === selectedProfileId))))}
                    className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30"
                  >
                    Descartar Alterações
                  </button>
                  <button 
                    disabled={!isDirty}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
                  >
                    <Save size={18} />
                    Salvar Mudanças
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Shield size={32} className="opacity-20 text-slate-900" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Nenhum perfil selecionado</h4>
              <p className="text-xs max-w-xs leading-relaxed">Escolha um perfil na lista ao lado para configurar permissões ou crie um novo perfil para sua organização.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                   <Shield size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-slate-900">Novo Perfil</h2>
                   <p className="text-xs text-slate-500">Defina o nome e propósito do perfil.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProfile} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Perfil</label>
                <input 
                  required
                  type="text" 
                  autoFocus
                  value={newProfile.name}
                  onChange={e => setNewProfile({...newProfile, name: e.target.value})}
                  placeholder="Ex: Supervisor de Vendas"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição das Atividades</label>
                <textarea 
                  required
                  rows={3}
                  value={newProfile.description}
                  onChange={e => setNewProfile({...newProfile, description: e.target.value})}
                  placeholder="Explique o que usuários deste perfil podem fazer..."
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-blue-500 transition-all resize-none text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl text-[11px] flex items-start gap-3 border border-amber-100 font-medium">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>O perfil será criado com permissões restritas (apenas visualização própria). Você poderá detalhar as permissões logo após a criação.</span>
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 text-sm font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Criar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;
