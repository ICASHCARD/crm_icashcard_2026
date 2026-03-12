
import React, { useState, useEffect } from 'react';
import { mockSystemModules, mockProfiles, mockUsers } from '../data/mockData';
import { 
  Settings, Save, CheckCircle2, Globe, Lock, AlertTriangle, ShieldAlert, GripVertical, ShieldCheck
} from 'lucide-react';
import { SystemModule } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { getModuleIcon } from '../services/iconService';
import Toggle from '../components/ui/Toggle';

const currentUser = mockUsers[0];

const Navigation: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [localEnabledIds, setLocalEnabledIds] = useState<string[]>(settings.enabledModuleIds);
  const [orderedModules, setOrderedModules] = useState<SystemModule[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const order = settings.moduleOrder || mockSystemModules.map(m => m.id);
    const sorted = [...mockSystemModules].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    setOrderedModules(sorted);
    setLocalEnabledIds(settings.enabledModuleIds);
  }, [settings.enabledModuleIds, settings.moduleOrder]);

  const isGlobalAdmin = currentUser.profileId === 'p1';

  const toggleGlobalModule = (id: string) => {
    if (!isGlobalAdmin) return;
    setLocalEnabledIds(prev => {
      const newIds = prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id];
      setIsDirty(true);
      return newIds;
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isGlobalAdmin) { e.preventDefault(); return; }
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingId === id) return;
    setDragOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) { setDraggingId(null); setDragOverId(null); return; }
    const newOrder = [...orderedModules];
    const draggedIndex = newOrder.findIndex(m => m.id === draggingId);
    const targetIndex = newOrder.findIndex(m => m.id === targetId);
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    setOrderedModules(newOrder);
    setIsDirty(true);
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleSave = () => {
    setSaving(true);
    updateSettings({ enabledModuleIds: localEnabledIds, moduleOrder: orderedModules.map(m => m.id) });
    setTimeout(() => { setSaving(false); setIsDirty(false); }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="text-blue-600" /> Menu & Navegação
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Arraste para reordenar e controle a visibilidade dos módulos.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <CheckCircle2 className="animate-bounce" size={20} /> : <Save size={20} />}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {!isGlobalAdmin && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 rounded-2xl flex items-center gap-4 text-amber-800 text-sm">
          <ShieldAlert size={20} className="text-amber-500" />
          <p className="font-bold">Apenas Administradores Globais podem gerenciar a ordem dos módulos.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Globe size={20} /></div>
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">ESTRUTURA DO MENU</h3>
                <p className="text-[11px] text-slate-400 font-medium">Reordene os módulos para todos os usuários.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {orderedModules.map((module) => {
                const isGloballyEnabled = localEnabledIds.includes(module.id);
                const isDragging = draggingId === module.id;
                const isOver = dragOverId === module.id;

                return (
                  <div 
                    key={module.id} 
                    draggable={isGlobalAdmin}
                    onDragStart={(e) => handleDragStart(e, module.id)}
                    onDragOver={(e) => handleDragOver(e, module.id)}
                    onDrop={(e) => handleDrop(e, module.id)}
                    onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                    className={`px-4 py-4 flex items-center justify-between transition-all duration-200 ${
                      isDragging ? 'opacity-30 bg-slate-50 scale-95' : 
                      isOver ? 'bg-blue-50/50 border-y border-blue-100' : 'hover:bg-slate-50/30 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {isGlobalAdmin && <div className="cursor-grab p-1 text-slate-300"><GripVertical size={20} /></div>}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isGloballyEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300 opacity-60'
                      }`}>
                        {getModuleIcon(module.label, 20)}
                      </div>
                      <div className="flex flex-col">
                        <h4 className={`text-sm font-bold tracking-tight ${isGloballyEnabled ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {module.label}
                        </h4>
                        <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest leading-none mt-0.5">{module.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right flex flex-col items-end hidden sm:flex">
                         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">ESTADO</p>
                         <p className={`text-[10px] font-black tracking-widest mt-1 ${isGloballyEnabled ? 'text-emerald-500' : 'text-rose-400'}`}>
                           {isGloballyEnabled ? 'VISÍVEL' : 'OCULTO'}
                         </p>
                      </div>
                      <Toggle 
                        enabled={isGloballyEnabled} 
                        onChange={() => toggleGlobalModule(module.id)} 
                        disabled={!isGlobalAdmin} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-125 transition-all"><Lock size={120} /></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"><ShieldCheck size={20} /></div>
                  <h3 className="font-bold text-lg text-white">Impacto na UX</h3>
                </div>
                <p className="text-indigo-100 text-xs leading-relaxed">A ordem definida aqui afetará imediatamente o menu lateral para todos os usuários.</p>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-slate-400">
                 <AlertTriangle size={20} className="text-amber-500" />
                 <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Atenção ao Mudar</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                "Alterar a ordem dos módulos pode exigir um período de adaptação dos usuários."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
