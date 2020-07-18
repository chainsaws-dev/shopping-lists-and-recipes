export interface AuthResponseData {
  Token: string;
  Email: string;
  ExpiresIn: string;
  Registered?: boolean;
  ExpirationDate?: string;
  Role: string;
}

export interface AuthRequest {
  Email: string;
  Password: string;
  ReturnSecureToken: boolean;
}
