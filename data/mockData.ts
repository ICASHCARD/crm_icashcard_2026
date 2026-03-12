
import { Person, Product, Sale, FinancialRecord, Invoice, Company, Profile, User, SystemModule, SystemSettings, Proposal } from '../types';

export const mockSystemModules: SystemModule[] = [
  { id: 'm1', label: 'Dashboard', resource: 'dashboard', isGloballyEnabled: true, category: 'Principal' },
  { 
    id: 'm12', 
    label: 'Propostas', 
    resource: 'proposals', 
    isGloballyEnabled: true, 
    category: 'Principal',
    subModules: [
      { label: 'Simular | Digitar', path: '/proposals/simulate' },
      { label: 'Acompanhar', path: '/proposals/tracking' }
    ]
  },
  { 
    id: 'm14', 
    label: 'Faturamento', 
    resource: 'billing', 
    isGloballyEnabled: true, 
    category: 'Principal',
    subModules: [
      { label: 'Relatório de vendas', path: '/billing/sales-report' },
      { label: 'Recibos', path: '/billing/receipts' }
    ]
  },
  { 
    id: 'm13', 
    label: 'Condições Comerciais', 
    resource: 'commercial', 
    isGloballyEnabled: true, 
    category: 'Principal',
    subModules: [
      { label: 'Fintech', path: '/commercial/fintechs' },
      { label: 'Grupo de comissão', path: '/commercial/groups' },
      { label: 'Tabela e Comissão', path: '/commercial/tables' },
      { label: 'Tabelas e links', path: '/commercial/links' }
    ]
  },
  { id: 'm2', label: 'Clientes', resource: 'clients', isGloballyEnabled: true, category: 'Principal' },
  { id: 'm3', label: 'Usuários', resource: 'companies', isGloballyEnabled: true, category: 'Principal' },
  { id: 'm4', label: 'Produtos', resource: 'products', isGloballyEnabled: true, category: 'Principal' },
  { id: 'm5', label: 'Vendas', resource: 'sales', isGloballyEnabled: true, category: 'Principal' },
  { id: 'm6', label: 'Financeiro', resource: 'finance', isGloballyEnabled: true, category: 'Principal' },
  { id: 'm7', label: 'NF-e', resource: 'finance', isGloballyEnabled: true, category: 'Principal' },
  { id: 'm8', label: 'Unidades / Empresas', resource: 'companies', isGloballyEnabled: true, category: 'Administração' },
  { id: 'm9', label: 'Perfis & Permissões', resource: 'companies', isGloballyEnabled: true, category: 'Administração' },
  { id: 'm10', label: 'Menu & Navegação', resource: 'navigation', isGloballyEnabled: true, category: 'Administração' },
  { id: 'm11', label: 'Identidade & Layout', resource: 'settings', isGloballyEnabled: true, category: 'Administração' },
];

export const mockProposals: Proposal[] = [
  {
    id: '1',
    code: '1777',
    nsu: 'NSU99281',
    product: 'Crédito Consignado',
    corban: 'Nexus Finanças',
    digitador: 'Juliana Costa',
    createdAt: '2023-11-20T10:30:00',
    creditDate: '2023-11-22T14:00:00',
    clientName: 'AFRANNYA MORAIS SILVA',
    clientCpf: '094.385.651-59',
    status: 'Em Análise',
    rg: '1591609',
    birthDate: '24-01-2003',
    email: 'afrannyaeduardo@gmail.com',
    address: 'Rua mn6, ao lado da casa 347, 0, 78.652-000, Morada nova, Confresa, MT',
    phone: '(66) 9 8448-4763',
    table: 'flex-4-azul',
    term: '12x',
    grossValue: 1354.80,
    netValue: 1000.00,
    installmentValue: 112.90,
    bank: 'Nubank',
    agency: '0001',
    account: '48822324-1',
    pixKey: '094.385.651-59',
    contractStatus: 'Aguardando Assinatura',
    documents: [
      { id: 'd1', type: 'RG Frente', status: 'Aprovado', updatedAt: '2023-11-20T11:00:00' },
      { id: 'd2', type: 'RG Verso', status: 'Aprovado', updatedAt: '2023-11-20T11:05:00' },
    ]
  }
];

export const mockProfiles: Profile[] = [
  {
    id: 'p1',
    name: 'Administrador Global',
    description: 'Acesso total a todas as funcionalidades e unidades do sistema.',
    userCount: 1,
    permissions: [
      { resource: 'dashboard', label: 'Dashboard', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'proposals', label: 'Propostas', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'billing', label: 'Faturamento', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'commercial', label: 'Comercial', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'sales', label: 'Vendas', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'finance', label: 'Financeiro', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'clients', label: 'Clientes', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'products', label: 'Produtos', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'companies', label: 'Empresas', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'navigation', label: 'Navegação', actions: { view: 'All', edit: true, delete: true, create: true } },
      { resource: 'settings', label: 'Configurações', actions: { view: 'All', edit: true, delete: true, create: true } },
    ]
  }
];

export const mockSystemSettings: SystemSettings = {
  systemName: 'Nexus ERP',
  companyName: 'Nexus Soluções Digitais',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#2563eb',
  secondaryColor: '#64748b',
  darkModeEnabled: false,
  compactMenu: false,
  sidebarTheme: 'light',
  enabledModuleIds: mockSystemModules.map(m => m.id),
  moduleOrder: mockSystemModules.map(m => m.id)
};

export const mockCompanies: Company[] = [
  { id: 'c1', status: 'Ativo', taxId: '12.345.678/0001-90', legalName: 'Matriz Nexus São Paulo', adminName: 'Ricardo Oliveira', userCount: 2, inclusionDate: '2023-01-10' },
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'Ricardo Oliveira', email: 'ricardo@nexus.com', profileId: 'p1', companyId: 'c1', status: 'Ativo', isMaster: true },
];

export const mockPeople: Person[] = [];
export const mockProducts: Product[] = [];
export const mockSales: Sale[] = [];
export const mockFinancial: FinancialRecord[] = [];
export const mockInvoices: Invoice[] = [];
