
import React, { useState, useMemo } from 'react';
import { mockProducts } from '../data/mockData';
import { Search, Plus, Tag, Box, DollarSign, Filter, Download } from 'lucide-react';
import { ProductStatus } from '../types';

const StatusBadge = ({ status }: { status: ProductStatus }) => {
  const styles = {
    'Ativo': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Inativo': 'bg-slate-100 text-slate-600 border-slate-200',
    'Sem Estoque': 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
};

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term) ||
        product.family.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      
      const matchesStatus = selectedStatus === 'Todos' || product.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Produtos & Estoque</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle seu catálogo e performance de vendas.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg uppercase tracking-widest">
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl"><Box size={28} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Itens Ativos</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{filteredProducts.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl"><DollarSign size={28} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Capital em Estoque</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">R$ {filteredProducts.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl"><Tag size={28} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Categorias</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{new Set(filteredProducts.map(p => p.category)).size}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar produto, código ou família..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-blue-500 transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-2xl px-5 py-3 outline-none focus:ring-2 ring-blue-500 dark:text-white"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Sem Estoque">Sem Estoque</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">CÓDIGO</th>
                <th className="px-6 py-4">PRODUTO</th>
                <th className="px-6 py-4">CATEGORIA</th>
                <th className="px-6 py-4 text-right">VALOR UNIT.</th>
                <th className="px-6 py-4 text-right">ESTOQUE</th>
                <th className="px-6 py-4 text-right">RECEITA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4"><StatusBadge status={product.status} /></td>
                  <td className="px-6 py-4"><span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900">{product.code}</span></td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{product.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{product.family}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">{product.category}</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-slate-900 dark:text-white">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-sm font-black ${product.stock <= 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{product.stock} un</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">S: {product.totalSold}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-emerald-600 tracking-tight">R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && <div className="py-20 text-center text-slate-400 text-sm font-bold">Nenhum produto encontrado.</div>}
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registros filtrados: {filteredProducts.length}</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed">Anterior</button>
            <button className="px-4 py-2 text-xs font-bold text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
