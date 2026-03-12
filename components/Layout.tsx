
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell,
  Search,
  ChevronRight,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { mockUsers, mockProfiles, mockSystemModules } from '../data/mockData';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { getModuleIcon, getModulePath } from '../services/iconService';

const SidebarItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
  primaryColor?: string;
  compact?: boolean;
  subModules?: { label: string; path: string }[];
}> = ({ to, icon, label, active, onClick, primaryColor, compact, subModules }) => {
  const [isOpen, setIsOpen] = useState(active);
  const location = useLocation();

  const hasSub = subModules && subModules.length > 0;

  return (
    <div className="space-y-1">
      <Link
        to={hasSub ? '#' : to}
        onClick={(e) => {
          if (hasSub) {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (onClick) {
            onClick();
          }
        }}
        style={active ? { backgroundColor: primaryColor || '#2563eb' } : {}}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
          active 
            ? 'text-white shadow-lg shadow-blue-100' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        } ${compact ? 'justify-center' : ''}`}
        title={compact ? label : ''}
      >
        <span className={`${active ? 'text-white' : 'group-hover:text-blue-600'} transition-colors shrink-0`}>
          {icon}
        </span>
        {!compact && (
          <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis flex-1">{label}</span>
        )}
        {!compact && hasSub && (
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        )}
        {active && !compact && !hasSub && <ChevronRight className="ml-auto w-4 h-4 shrink-0" />}
      </Link>

      {hasSub && isOpen && !compact && (
        <div className="pl-12 space-y-1">
          {subModules.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              onClick={onClick}
              className={`block py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                location.pathname === sub.path 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  if (!user) return null;
  
  const profile = mockProfiles.find(p => p.id === user.profileId);

  const canShow = (resource: string, label: string) => {
    const moduleConfig = mockSystemModules.find(m => m.label === label);
    if (moduleConfig && !settings.enabledModuleIds.includes(moduleConfig.id)) return false;
    if (!profile) return false;
    const perm = profile.permissions.find(p => p.resource === resource);
    return perm && perm.actions.view !== 'None';
  };

  const order = settings.moduleOrder || mockSystemModules.map(m => m.id);
  const orderedModules = [...mockSystemModules].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const menuItems = orderedModules
    .filter(m => m.category === 'Principal' && canShow(m.resource, m.label))
    .map(m => ({ 
      to: getModulePath(m.label), 
      icon: getModuleIcon(m.label), 
      label: m.label,
      subModules: m.subModules 
    }));

  // Fix: Added subModules to settingsItems to ensure it matches the SidebarItem interface and allows safe access in group mappings
  const settingsItems = orderedModules
    .filter(m => m.category === 'Administração' && canShow(m.resource, m.label))
    .map(m => ({ 
      to: getModulePath(m.label), 
      icon: getModuleIcon(m.label), 
      label: m.label,
      subModules: m.subModules 
    }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${settings.darkModeEnabled ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside 
        style={settings.sidebarTheme === 'colored' ? { backgroundColor: settings.primaryColor } : {}}
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 lg:relative lg:translate-x-0 border-r ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${settings.compactMenu ? 'w-20' : 'w-72'} ${
          settings.sidebarTheme === 'dark' ? 'bg-slate-900 text-white border-slate-800' : 
          settings.sidebarTheme === 'light' ? 'bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:border-slate-800' : ''
        }`}
      >
        <div className={`flex flex-col h-full ${settings.compactMenu ? 'px-2' : 'px-4'} py-6 overflow-y-auto no-scrollbar`}>
          <div className={`flex items-center ${settings.compactMenu ? 'justify-center' : 'gap-3 px-4'} mb-8`}>
            <div 
              style={{ backgroundColor: settings.sidebarTheme === 'colored' ? 'rgba(255,255,255,0.2)' : settings.primaryColor }}
              className={`rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0 w-10 h-10`}
            >
              {settings.logoUrl ? <img src={settings.logoUrl} className="p-1" alt="Logo" /> : settings.systemName.substring(0, 1)}
            </div>
            {!settings.compactMenu && (
              <span className={`text-xl font-bold tracking-tight ${settings.sidebarTheme !== 'light' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {settings.systemName}
              </span>
            )}
          </div>

          <div className="space-y-6 flex-1">
            {[ { title: 'Principal', items: menuItems }, { title: 'Administração', items: settingsItems } ].map(group => group.items.length > 0 && (
              <nav key={group.title} className="space-y-1.5">
                {!settings.compactMenu && (
                  <p className={`px-4 text-[10px] font-bold uppercase tracking-widest mb-2 ${settings.sidebarTheme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>
                    {group.title}
                  </p>
                )}
                {group.items.map(item => (
                  <SidebarItem 
                    key={item.to} 
                    {...item} 
                    compact={settings.compactMenu}
                    primaryColor={settings.sidebarTheme === 'colored' ? 'rgba(255,255,255,0.15)' : settings.primaryColor}
                    active={location.pathname === item.to || (item.subModules && item.subModules.some(sm => location.pathname === sm.path))}
                    onClick={() => setIsSidebarOpen(false)}
                  />
                ))}
              </nav>
            ))}
          </div>

          <div className={`pt-6 border-t ${settings.sidebarTheme === 'light' ? 'border-slate-100 dark:border-slate-800' : 'border-white/10'}`}>
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full py-3 rounded-xl transition-all group ${settings.compactMenu ? 'justify-center px-2' : 'px-4'} ${settings.sidebarTheme === 'light' ? 'text-slate-500 hover:text-red-600 hover:bg-red-50' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <LogOut size={18} />
              {!settings.compactMenu && <span className="font-medium text-sm">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden text-slate-900 dark:text-white">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <button className="p-2 text-slate-500 lg:hidden" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Search className="text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Pesquisar..." className="bg-transparent border-none focus:outline-none ml-2 text-sm w-64 dark:text-white" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 dark:text-slate-400"><Bell size={20} /></button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user.isMaster ? 'Administrador Master' : profile?.name || 'Colaborador'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                <img src={`https://picsum.photos/seed/${user.id}/40/40`} alt="P" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
