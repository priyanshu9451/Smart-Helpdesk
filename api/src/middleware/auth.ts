import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../lib/jwt";

export interface AuthUser {
  _id: string;
  role: "admin" | "agent" | "user";
  email: string;
  name: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : "";
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    const user = verifyJwt<AuthUser>(token);
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;
    if (!user) return res.status(401).json({ error: "unauthorized" });
    if (!roles.includes(user.role)) return res.status(403).json({ error: "forbidden" });
    next();
  };
}
