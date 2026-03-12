
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, ShoppingCart, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import AIInsights from './AIInsights';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Fev', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Abr', revenue: 2780, expenses: 3908 },
  { name: 'Mai', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const categoryData = [
  { name: 'Eletrônicos', value: 400 },
  { name: 'Móveis', value: 300 },
  { name: 'Periféricos', value: 300 },
  { name: 'Acessórios', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
          <p className="text-slate-500">Bem-vindo de volta, aqui estão as métricas de hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-slate-200 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 ring-blue-500 transition-all">
            <option>Últimos 30 dias</option>
            <option>Último trimestre</option>
            <option>Este ano</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Receitas" 
          value="R$ 45.231,89" 
          icon={TrendingUp} 
          trend="+12.5%" 
          trendUp={true} 
          color="blue" 
        />
        <StatsCard 
          label="Despesas" 
          value="R$ 12.843,10" 
          icon={CreditCard} 
          trend="-2.4%" 
          trendUp={false} 
          color="red" 
        />
        <StatsCard 
          label="Novas Vendas" 
          value="142" 
          icon={ShoppingCart} 
          trend="+8.2%" 
          trendUp={true} 
          color="green" 
        />
        <StatsCard 
          label="Novos Clientes" 
          value="12" 
          icon={Users} 
          trend="+1.2%" 
          trendUp={true} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900">Fluxo de Caixa</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Receitas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span>Despesas</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Column */}
        <div className="space-y-8">
          <AIInsights />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Vendas por Categoria</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                  <span className="text-slate-500 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
