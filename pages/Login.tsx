
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck, ChevronRight, Eye, EyeOff, Info, UserCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao tentar realizar o login.");
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin123'); // Senha fictícia para o mockup
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-2 md:p-4 transition-colors duration-500 overflow-hidden ${settings.darkModeEnabled ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-[1200px] max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-2rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[36px] lg:rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Lado Esquerdo: Branding e Impacto */}
        <div className="hidden lg:flex flex-col justify-between min-h-0 p-8 xl:p-12 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white relative overflow-y-auto">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                   <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                 </pattern>
               </defs>
               <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
               <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                  <ShieldCheck size={32} className="text-white" />
               </div>
               <span className="text-3xl font-black tracking-tighter uppercase">{settings.systemName}</span>
            </div>
            
            <div className="space-y-5 md:space-y-6 lg:space-y-5">
              <h1 className="text-4xl xl:text-6xl font-black leading-[1.1] tracking-tighter">
                O futuro da <br />
                <span className="text-blue-200">gestão ERP</span> <br />
                começa aqui.
              </h1>
              <p className="text-blue-100 text-base xl:text-xl max-w-md leading-relaxed font-medium">
                Sincronize suas unidades, controle finanças e tome decisões baseadas em dados com IA.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4 pb-2 xl:pb-4">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 xl:p-5 rounded-[24px] xl:rounded-[28px] border border-white/10">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-blue-600 overflow-hidden shadow-lg">
                    <img src={`https://picsum.photos/seed/user${i}/48/48`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Média de satisfação 4.9/5</p>
                <p className="text-[11px] font-medium text-blue-200 uppercase tracking-widest mt-0.5">Baseado em +10k feedbacks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="p-6 md:p-10 xl:p-14 flex flex-col justify-center bg-white dark:bg-slate-900 overflow-y-auto">
          <div className="mb-6 md:mb-8 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 md:mb-3 tracking-tight">Login.</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Insira os dados da sua conta corporativa.</p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-[24px] flex items-center gap-4 text-rose-600 dark:text-rose-400 text-sm animate-in slide-in-from-top-4 duration-500">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <p className="font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 lg:space-y-5">
            <div className="space-y-2">
              <label className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">E-mail Institucional</label>
              <div className="relative group">
                <Mail className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  required
                  type="email"
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm lg:text-base rounded-[18px] lg:rounded-[20px] pl-12 lg:pl-14 pr-4 lg:pr-5 py-3.5 lg:py-4 focus:ring-4 ring-blue-500/10 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <label className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Senha de Segurança</label>
                <button type="button" className="text-[11px] font-black text-blue-600 dark:text-blue-400 hover:underline">Recuperar</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm lg:text-base rounded-[18px] lg:rounded-[20px] pl-12 lg:pl-14 pr-12 lg:pr-12 py-3.5 lg:py-4 focus:ring-4 ring-blue-500/10 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="••••••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 px-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all" 
              />
              <label htmlFor="remember" className="text-sm font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none">Manter minha sessão ativa</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 lg:py-4 bg-blue-600 text-white rounded-[18px] lg:rounded-[20px] font-black text-sm lg:text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-2xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-2 lg:gap-3 group disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  ENTRAR NO SISTEMA
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Access Area - For Mockup only */}
          <div className="mt-8 md:mt-12 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-[24px] md:rounded-[32px] animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                   <UserCheck size={18} />
                </div>
                <div>
                   <h3 className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Acesso de Demonstração</h3>
                   <p className="text-[10px] text-blue-500 font-medium italic">Clique para preencher automaticamente</p>
                </div>
             </div>
             
             <button 
               onClick={() => fillDemoAccount('ricardo@nexus.com')}
               className="w-full p-4 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all group"
             >
                <div className="text-left">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Administrador Global</p>
                   <p className="text-sm font-bold text-slate-700 dark:text-slate-200">ricardo@nexus.com</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <ChevronRight size={16} />
                </div>
             </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              Segurança certificada SSL/TLS • {new Date().getFullYear()} <br />
              <span className="opacity-60">{settings.companyName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
