import { Request, Response, NextFunction } from "express";
import "../lib/session";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.session?.user;
  if (!user || !user.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
