
import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { getBusinessInsights } from '../services/gemini';
import { mockFinancial, mockSales, mockProducts } from '../data/mockData';

const AIInsights: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const result = await getBusinessInsights(mockFinancial, mockSales, mockProducts);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform">
        <Sparkles size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <h2 className="text-lg font-bold">Insights Inteligentes</h2>
        </div>
        
        {!insight && !loading && (
          <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
            Nossa IA pode analisar seus dados financeiros e operacionais para sugerir estratégias e apontar pontos críticos.
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
            <p className="text-sm text-indigo-100">Analisando dados do sistema...</p>
          </div>
        ) : insight ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 text-sm leading-relaxed whitespace-pre-wrap border border-white/20">
            {insight}
          </div>
        ) : null}

        <button 
          onClick={generate}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {insight ? <RefreshCw size={18} /> : null}
          {loading ? 'Processando...' : insight ? 'Gerar Novamente' : 'Analisar meu Negócio'}
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
