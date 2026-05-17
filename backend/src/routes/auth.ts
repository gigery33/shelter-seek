import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import "../lib/session";

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

router.post(
  "/login",
  asyncHandler(async (req, res) => {
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

    req.session.user = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    res.json({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  })
);

router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy?.((err) => {
    if (err) console.error("Session destroy error:", err);
  });
  res.json({ ok: true });
});

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const user = req.session?.user;
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const exists = await prisma.user.findUnique({ where: { id: user.id } });
    if (!exists) {
      req.session.destroy?.((err) => {
        if (err) console.error("Session destroy error:", err);
      });
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json(user);
  })
);

export default router;
