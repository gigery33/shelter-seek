import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/admin";

const router = Router();

const createSchema = z.object({
  shelterId: z.string().optional(),
  type: z.enum(["CLOSED", "EMERGENCY", "OTHER"]),
  comment: z.string().optional(),
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const report = await prisma.report.create({ data: parsed.data });
  res.status(201).json(report);
});

router.get("/", requireAdmin, async (req: Request, res: Response) => {
  const status = (req.query.status as string) || "OPEN";

  const reports = await prisma.report.findMany({
    where: { status: status as any },
    orderBy: { createdAt: "desc" },
  });
  res.json(reports);
});

router.patch("/:id/resolve", requireAdmin, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  const report = await prisma.report.update({
    where: { id },
    data: { status: "RESOLVED", resolvedAt: new Date() },
  });
  res.json(report);
});

export default router;
