export interface Token {
  accessToken: string;
  expiresAt: Date;
  refreshToken?: string;
}
