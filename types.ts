
export type Status = 'Paid' | 'Pending' | 'Overdue';
export type ProductStatus = 'Ativo' | 'Inativo' | 'Sem Estoque';
export type InvoiceStatus = 'Autorizada' | 'Cancelada' | 'Pendente' | 'Inutilizada';
export type InvoiceType = 'Entrada' | 'Saída';
export type PersonStatus = 'Ativo' | 'Inativo';
export type PersonTag = 'Cliente' | 'Fornecedor' | 'Transportadora';
export type SaleStatus = 'Pendente' | 'Faturado' | 'Cancelado' | 'Aguardando Pagamento';

export type ContractStatus = 'Não Gerado' | 'Aguardando Assinatura' | 'Assinado';

export type ProposalStatus = 
  | 'PEN - Envio Documento' 
  | 'Em análise documental' 
  | 'Reprova documental' 
  | 'Link Pag. Enviado' 
  | 'Link Pag. Aprovado' 
  | 'Link Pag. Reprovado' 
  | 'Aguardando formalização' 
  | 'Em análise formalização' 
  | 'Liberar Crédito' 
  | 'Crédito Enviado' 
  | 'Aguardando Confirmação' 
  | 'Cancelada'
  | 'Pendente' 
  | 'Em Análise' 
  | 'Aprovado' 
  | 'Reprovado' 
  | 'Assinado' 
  | 'Faturado';

export type DocStatus = 'Pendente' | 'Aprovado' | 'Reprovado' | 'Aguardando Reenvio';

export interface ProposalDocument {
  id: string;
  type: string;
  status: DocStatus;
  url?: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  code: string;
  nsu: string;
  product: string;
  corban: string;
  digitador: string;
  createdAt: string;
  creditDate?: string;
  clientName: string;
  clientCpf: string;
  status: ProposalStatus;
  rg: string;
  birthDate: string;
  email: string;
  address: string;
  phone: string;
  table: string;
  term: string;
  grossValue: number;
  netValue: number;
  installmentValue: number;
  bank: string;
  agency: string;
  account: string;
  pixKey: string;
  pixType?: string;
  description?: string;
  paymentLink?: string;
  rejectionReason?: string;
  observation?: string;
  paymentProofUrl?: string;
  contractStatus?: ContractStatus;
  documents: ProposalDocument[];
}

export type PermissionLevel = 'None' | 'Own' | 'All';

export interface Permissions {
  view: PermissionLevel;
  edit: boolean;
  delete: boolean;
  create: boolean;
}

export interface ResourcePermissions {
  resource: string;
  label: string;
  actions: Permissions;
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: ResourcePermissions[];
}

export interface Company {
  id: string;
  status: 'Ativo' | 'Inativo';
  taxId: string; // CNPJ
  legalName: string; // Razão Social
  adminName: string;
  userCount: number;
  inclusionDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileId: string;
  companyId: string;
  status: 'Ativo' | 'Inativo';
  isMaster?: boolean;
}

export interface Person {
  id: string;
  status: PersonStatus;
  taxId: string;
  name: string;
  tradingName?: string;
  tags: PersonTag[];
  inclusionDate: string;
  email: string;
  phone: string;
  totalSpent: number;
  totalPending: number;
  lastActive: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  family: string;
  price: number;
  stock: number;
  totalSold: number;
  revenue: number;
  status: ProductStatus;
}

export interface Sale {
  id: string;
  code: string;
  status: SaleStatus;
  taxId: string;
  tradingName: string;
  legalName: string;
  totalValue: number;
  installments: number;
  tags: string[];
  category: string;
  date: string;
}

export interface FinancialRecord {
  id: string;
  personId: string;
  personName: string;
  personTaxId: string;
  type: 'Payable' | 'Receivable';
  amount: number;
  issueDate: string;
  dueDate: string;
  registrationDate: string;
  status: Status;
  category: string;
}

export interface Invoice {
  id: string;
  type: InvoiceType;
  issueDate: string;
  registrationDate: string;
  status: InvoiceStatus;
  operation: string;
  number: string;
  taxId: string;
  legalName: string;
  tradingName: string;
  value: number;
}

export interface DashboardStats {
  totalReceivable: number;
  totalPayable: number;
  overdueCount: number;
  monthlyRevenue: number;
  salesGrowth: number;
}

export interface SystemModule {
  id: string;
  label: string;
  resource: string;
  isGloballyEnabled: boolean;
  category: 'Principal' | 'Administração';
  subModules?: { label: string; path: string }[];
}

export interface SystemSettings {
  systemName: string;
  companyName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  darkModeEnabled: boolean;
  compactMenu: boolean;
  sidebarTheme: 'light' | 'dark' | 'colored';
  enabledModuleIds: string[];
  moduleOrder: string[]; // Added to persist custom order
}
