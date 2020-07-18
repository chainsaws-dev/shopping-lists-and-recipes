export interface AuthResponseData {
  Token: string;
  Email: string;
  ExpiresIn: string;
  registered?: boolean;
  expirationDate?: string;
}

