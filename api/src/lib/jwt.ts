import jwt, { type SignOptions, type Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.,env.JWT_SECRET || "change-me";

export function signJwt(
  payload: string | object | Buffer,
  expiresIn: string = "1h"
): string {
  const options: SignOptions = { expiresIn: expiresIn as any }; // cast to bypass type check
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
