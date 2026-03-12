export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileId: string;
    companyId: string;
    status: 'Ativo' | 'Inativo';
    isMaster?: boolean;
  };
}
