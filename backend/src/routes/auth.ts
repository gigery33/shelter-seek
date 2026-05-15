import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  (req as any).session.user = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  res.json({
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

router.post("/logout", (req: Request, res: Response) => {
  (req as any).session.destroy?.();
  res.json({ ok: true });
});

router.get("/me", (req: Request, res: Response) => {
  const user = (req as any).session?.user;
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(user);
});

export default router;
