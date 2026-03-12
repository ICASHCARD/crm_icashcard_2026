import { APP_ENV } from '@/config/env';
import type { Proposal, ProposalStatus } from '@/types';

type SupabaseProposalRow = {
  source_id: number;
  proposal_to: string | null;
  customer_email: string | null;
  etapa: string | null;
  total_amount: string | number | null;
  proposal_date: string | null;
  payment_date: string | null;
  payment_from_manager: string | null;
  payment_status_code: number | null;
  payment_description: string | null;
  payment_message: string | null;
  crm_customer_id: number | null;
  source_created_at: string | null;
  source_updated_at: string | null;
};

const STATUS_FALLBACK: ProposalStatus = 'Pendente';

const knownStatuses = new Set<ProposalStatus>([
  'PEN - Envio Documento',
  'Em análise documental',
  'Reprova documental',
  'Link Pag. Enviado',
  'Link Pag. Aprovado',
  'Link Pag. Reprovado',
  'Aguardando formalização',
  'Em análise formalização',
  'Liberar Crédito',
  'Crédito Enviado',
  'Aguardando Confirmação',
  'Cancelada',
  'Pendente',
  'Em Análise',
  'Aprovado',
  'Reprovado',
  'Assinado',
  'Faturado',
]);

function toStatus(input?: string | null): ProposalStatus {
  if (!input) return STATUS_FALLBACK;
  return knownStatuses.has(input as ProposalStatus) ? (input as ProposalStatus) : STATUS_FALLBACK;
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toProposal(row: SupabaseProposalRow): Proposal {
  const code = String(row.source_id ?? '');
  const netValue = toNumber(row.total_amount);
  const status = toStatus(row.etapa);

  return {
    id: code,
    code,
    nsu: '',
    product: 'Crédito Consignado',
    corban: 'ICASHCARD',
    digitador: '-',
    createdAt: row.source_created_at || row.proposal_date || new Date().toISOString(),
    creditDate: row.payment_from_manager || row.payment_date || undefined,
    clientName: row.proposal_to || 'Não informado',
    clientCpf: '',
    status,
    rg: '',
    birthDate: '',
    email: row.customer_email || '',
    address: '',
    phone: '',
    table: '-',
    term: '-',
    grossValue: netValue,
    netValue,
    installmentValue: 0,
    bank: '-',
    agency: '-',
    account: '-',
    pixKey: '-',
    pixType: undefined,
    description: row.payment_description || undefined,
    paymentLink: undefined,
    rejectionReason: row.payment_message || undefined,
    observation: row.payment_message || undefined,
    paymentProofUrl: undefined,
    contractStatus: 'Não Gerado',
    documents: [],
  };
}

export const proposalsApi = {
  async list(): Promise<Proposal[]> {
    const url = `${APP_ENV.API_BASE_URL}/crm_proposals?select=source_id,proposal_to,customer_email,etapa,total_amount,proposal_date,payment_date,payment_from_manager,payment_status_code,payment_description,payment_message,crm_customer_id,source_created_at,source_updated_at&order=source_id.desc&limit=500`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
      headers.apikey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      headers.Authorization = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error('Falha ao carregar propostas do Supabase.');
    }

    const rows = (await response.json()) as SupabaseProposalRow[];
    return rows.map(toProposal);
  },
};
