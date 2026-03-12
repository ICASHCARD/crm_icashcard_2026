
import { GoogleGenAI } from "@google/genai";
import { Product, Sale, FinancialRecord } from "../types";
import { APP_ENV } from "@/config/env";

/**
 * Professional business analysis service using Google Gemini API.
 * Adheres to strict @google/genai SDK guidelines.
 */
export const getBusinessInsights = async (
  financial: FinancialRecord[],
  sales: Sale[],
  products: Product[]
): Promise<string> => {
  // Always initialize right before use as per security guidelines.
  if (!APP_ENV.GEMINI_API_KEY) {
    return "API de IA nao configurada. Defina VITE_GEMINI_API_KEY no ambiente.";
  }

  const ai = new GoogleGenAI({ apiKey: APP_ENV.GEMINI_API_KEY });
  
  const summary = {
    receivables: financial.filter(f => f.type === 'Receivable').reduce((acc, curr) => acc + curr.amount, 0),
    payables: financial.filter(f => f.type === 'Payable').reduce((acc, curr) => acc + curr.amount, 0),
    overdue: financial.filter(f => f.status === 'Overdue').length,
    topProduct: products.sort((a, b) => b.revenue - a.revenue)[0]?.name,
    recentSales: sales.length
  };

  const prompt = `
    Analise os seguintes dados de desempenho empresarial e forneça um resumo executivo profissional e conciso com conselhos estratégicos.
    Foque na saúde financeira, fluxo de caixa e desempenho de vendas.
    
    Resumo dos Dados:
    - Total a Receber: R$ ${summary.receivables.toFixed(2)}
    - Total a Pagar: R$ ${summary.payables.toFixed(2)}
    - Registros Atrasados: ${summary.overdue}
    - Produto Mais Vendido: ${summary.topProduct}
    - Contagem de Vendas Recentes: ${summary.recentSales}
    
    Forneça insights em Português do Brasil. Use bullet points para recomendações.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Property access .text as per SDK specifications (not a method call).
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao processar insights inteligentes. Verifique as configurações de API.";
  }
};
