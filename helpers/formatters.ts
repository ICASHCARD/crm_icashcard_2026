export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
