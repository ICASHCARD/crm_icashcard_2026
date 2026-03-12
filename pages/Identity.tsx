
import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { mockSystemSettings, mockUsers } from '../data/mockData';
import { 
  Palette, 
  Save, 
  Upload, 
  Monitor, 
  Image as ImageIcon, 
  Hash, 
  LayoutTemplate,
  CheckCircle2,
  Undo2,
  Smartphone,
  Info,
  Type,
  Check
} from 'lucide-react';
import { SystemSettings } from '../types';

const currentUser = mockUsers[0];

const Identity: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const isGlobalAdmin = currentUser.profileId === 'p1';

  const handleUpdate = (updates: Partial<SystemSettings>) => {
    setLocalSettings(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setSaving(true);
    // Persist to global context
    updateSettings(localSettings);
    
    setTimeout(() => {
      setSaving(false);
      setIsDirty(false);
      // Feedback can also be a toast if implemented globally, but here we stay simple
    }, 800);
  };

  const handleReset = () => {
    setLocalSettings(mockSystemSettings);
    setIsDirty(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Palette className="text-blue-600" />
            Identidade & Layout
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Personalize a marca e as cores que seus usuários visualizarão.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isDirty && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <Undo2 size={18} />
              Resetar Padrão
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={!isDirty || saving || !isGlobalAdmin}
            style={{ backgroundColor: localSettings.primaryColor }}
            className="flex items-center justify-center gap-2 text-white px-8 py-3 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {saving ? <CheckCircle2 className="animate-bounce" size={20} /> : <Save size={20} />}
            {saving ? 'Aplicando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {!isGlobalAdmin && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center gap-4 text-blue-700 dark:text-blue-400 text-sm shadow-sm">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <Info size={20} />
          </div>
          <span>Apenas Administradores Globais podem modificar a identidade visual do sistema corporativo.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Forms Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Branding */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/30">
              <Type className="text-slate-400" size={20} />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Branding Geral</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Sistema</label>
                  <input 
                    type="text"
                    value={localSettings.systemName}
                    onChange={e => handleUpdate({ systemName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl px-5 py-3.5 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Ex: Nexus ERP"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome da Empresa (Footer)</label>
                  <input 
                    type="text"
                    value={localSettings.companyName}
                    onChange={e => handleUpdate({ companyName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl px-5 py-3.5 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Sua Empresa Ltda"
                  />
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identidade Visual (Logotipos)</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                       <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                          <ImageIcon size={24} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Logo Principal</p>
                          <p className="text-[10px] text-slate-400">PNG ou SVG (Fundo Transparente)</p>
                       </div>
                       <button className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                          <Upload size={12} /> Selecionar
                       </button>
                    </div>
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                       <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                          <Hash size={24} />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Favicon</p>
                          <p className="text-[10px] text-slate-400">Ícone da aba (32x32px)</p>
                       </div>
                       <button className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1">
                          <Upload size={12} /> Selecionar
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/30">
              <Hash className="text-slate-400" size={20} />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Esquema de Cores</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cor Primária (Brand)</label>
                    <div className="flex items-center gap-4">
                       <input 
                         type="color" 
                         value={localSettings.primaryColor}
                         onChange={e => handleUpdate({ primaryColor: e.target.value })}
                         className="w-14 h-14 rounded-2xl border-none cursor-pointer p-0 overflow-hidden"
                       />
                       <input 
                         type="text" 
                         value={localSettings.primaryColor}
                         onChange={e => handleUpdate({ primaryColor: e.target.value })}
                         className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl px-5 py-3.5 outline-none font-mono dark:text-white"
                       />
                    </div>
                 </div>
                 <div className="flex-1 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tema da Sidebar</label>
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                       <button 
                         onClick={() => handleUpdate({ sidebarTheme: 'light' })}
                         className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${localSettings.sidebarTheme === 'light' ? 'bg-white shadow-sm text-blue-600 dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                       >
                         Claro
                       </button>
                       <button 
                         onClick={() => handleUpdate({ sidebarTheme: 'dark' })}
                         className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${localSettings.sidebarTheme === 'dark' ? 'bg-slate-900 shadow-sm text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                       >
                         Escuro
                       </button>
                       <button 
                         onClick={() => handleUpdate({ sidebarTheme: 'colored' })}
                         className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${localSettings.sidebarTheme === 'colored' ? 'shadow-sm text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                         style={localSettings.sidebarTheme === 'colored' ? { backgroundColor: localSettings.primaryColor } : {}}
                       >
                         Colorido
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview & Toggles Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Preview em Tempo Real</h3>
            <div className="bg-slate-200 dark:bg-slate-800 rounded-[40px] p-6 shadow-inner border-4 border-slate-300 dark:border-slate-700">
               {/* Simplified UI Preview */}
               <div className={`bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden shadow-2xl flex h-[400px] border border-slate-100 dark:border-slate-800 ${localSettings.darkModeEnabled ? 'dark' : ''}`}>
                  {/* Mock Sidebar */}
                  <div className={`transition-all duration-300 flex flex-col items-center py-6 gap-4 border-r ${
                    localSettings.compactMenu ? 'w-16' : 'w-32'
                  } ${
                    localSettings.sidebarTheme === 'light' ? 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800' : 
                    localSettings.sidebarTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 
                    ''
                  }`} style={localSettings.sidebarTheme === 'colored' ? { backgroundColor: localSettings.primaryColor } : {}}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: localSettings.sidebarTheme === 'colored' ? 'rgba(255,255,255,0.2)' : localSettings.primaryColor }}>
                       {localSettings.systemName.substring(0,1)}
                    </div>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-8 rounded-lg ${localSettings.compactMenu ? 'w-8' : 'w-20'} ${i === 1 ? '' : (localSettings.sidebarTheme === 'light' ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white/10')}`} style={i === 1 ? { backgroundColor: localSettings.sidebarTheme === 'colored' ? 'rgba(255,255,255,0.15)' : localSettings.primaryColor } : {}} />
                    ))}
                  </div>
                  {/* Mock Content */}
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                       <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="h-8 w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800" />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-2 flex flex-col justify-end">
                            <div className="h-2 w-8 bg-slate-100 dark:bg-slate-800 rounded mb-1" />
                            <div className="h-4 w-12 rounded" style={{ backgroundColor: localSettings.primaryColor + '20' }} />
                        </div>
                        <div className="h-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800" />
                    </div>
                    <div className="h-24 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                       <div className="h-8 w-24 rounded-xl shadow-lg" style={{ backgroundColor: localSettings.primaryColor }} />
                    </div>
                  </div>
               </div>
               
               <div className="mt-6 flex justify-center gap-4 text-slate-400">
                  <Monitor size={20} className={localSettings.darkModeEnabled ? 'text-slate-600' : 'text-blue-500'} />
                  <Smartphone size={20} />
               </div>
            </div>
            
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
               <div className="flex items-center gap-3 text-slate-400">
                  <LayoutTemplate size={18} className="text-blue-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Opções de Visualização</h4>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleUpdate({ darkModeEnabled: !localSettings.darkModeEnabled })}>
                    <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Habilitar Modo Escuro</p>
                        <p className="text-[10px] text-slate-400">Reduz o cansaço visual em ambientes escuros.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${localSettings.darkModeEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${localSettings.darkModeEnabled ? 'translate-x-6' : ''}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => handleUpdate({ compactMenu: !localSettings.compactMenu })}>
                    <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Menu Compacto</p>
                        <p className="text-[10px] text-slate-400">Maximiza a área de trabalho ocultando rótulos.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${localSettings.compactMenu ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${localSettings.compactMenu ? 'translate-x-6' : ''}`} />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;
