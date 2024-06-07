import User from '@/user/entities/user.entity';

export interface IJWTPayload {
  sub: number;
  email?: string;
}

export interface IJwtPayloadWithRt extends IJWTPayload {
  refresh_token: string;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginDetector {
  ip: string;
  headers: Record<string, string>;
}

export enum LoginStatus {
  FAILED,
  SUCCEED,
}

export enum Social {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export interface LoginTracking {
  user: User;
  status: LoginStatus;
  result: ITokens;
  detector: LoginDetector;
}
