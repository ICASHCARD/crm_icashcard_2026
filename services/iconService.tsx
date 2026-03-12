
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Package, 
  ShoppingCart, 
  Banknote, 
  Receipt, 
  Building2, 
  ShieldCheck, 
  Compass, 
  Palette,
  ChevronRight,
  ClipboardList,
  Tags,
  Link as LinkIcon,
  CreditCard,
  Layers,
  Table,
  Calculator,
  TrendingUp,
  FileBarChart,
  FileText
} from 'lucide-react';

export const getModuleIcon = (label: string, size = 18) => {
  const icons: Record<string, React.ReactNode> = {
    'Dashboard': <LayoutDashboard size={size} />,
    'Propostas': <ClipboardList size={size} />,
    'Faturamento': <TrendingUp size={size} />,
    'Condições Comerciais': <Tags size={size} />,
    'Clientes': <Users size={size} />,
    'Usuários': <UserCog size={size} />,
    'Produtos': <Package size={size} />,
    'Vendas': <ShoppingCart size={size} />,
    'Financeiro': <Banknote size={size} />,
    'NF-e': <Receipt size={size} />,
    'Unidades / Empresas': <Building2 size={size} />,
    'Perfis & Permissões': <ShieldCheck size={size} />,
    'Menu & Navegação': <Compass size={size} />,
    'Identidade & Layout': <Palette size={size} />,
    // Submodules icons
    'Fintech': <CreditCard size={size} />,
    'Grupo de comissão': <Layers size={size} />,
    'Tabela e Comissão': <Table size={size} />,
    'Tabelas e links': <LinkIcon size={size} />,
    'Simular | Digitar': <Calculator size={size} />,
    'Acompanhar': <ClipboardList size={size} />,
    'Relatório de vendas': <FileBarChart size={size} />,
    'Recibos': <FileText size={size} />,
  };
  return icons[label] || <ChevronRight size={size} />;
};

export const getModulePath = (label: string) => {
  const paths: Record<string, string> = {
    'Dashboard': '/',
    'Propostas': '/proposals/simulate',
    'Faturamento': '/billing/sales-report',
    'Condições Comerciais': '/commercial/tables', 
    'Clientes': '/clients',
    'Usuários': '/users',
    'Produtos': '/products',
    'Vendas': '/sales',
    'Financeiro': '/finance',
    'NF-e': '/invoices',
    'Unidades / Empresas': '/companies',
    'Perfis & Permissões': '/profiles',
    'Menu & Navegação': '/navigation',
    'Identidade & Layout': '/identity',
    'Fintech': '/commercial/fintechs',
    'Grupo de comissão': '/commercial/groups',
    'Tabela e Comissão': '/commercial/tables',
    'Tabelas e links': '/commercial/links',
    'Simular | Digitar': '/proposals/simulate',
    'Acompanhar': '/proposals/tracking',
    'Relatório de vendas': '/billing/sales-report',
    'Recibos': '/billing/receipts',
  };
  return paths[label] || '/';
};
