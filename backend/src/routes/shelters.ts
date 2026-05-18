import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/admin";

const router = Router();

const ukrToLat: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
  ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya",
  А: "A", Б: "B", В: "V", Г: "H", Ґ: "G", Д: "D", Е: "E", Є: "Ye",
  Ж: "Zh", З: "Z", И: "Y", І: "I", Ї: "Yi", Й: "Y", К: "K", Л: "L",
  М: "M", Н: "N", О: "O", П: "P", Р: "R", С: "S", Т: "T", У: "U",
  Ф: "F", Х: "Kh", Ц: "Ts", Ч: "Ch", Ш: "Sh", Щ: "Shch", Ь: "", Ю: "Yu", Я: "Ya",
};

function getId(req: Request): string {
  return String(req.params.id);
}

function slugify(text: string): string {
  return text
    .split("")
    .map((ch) => ukrToLat[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const shelterSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["BOMB_SHELTER", "UNDERGROUND_PARKING", "METRO"]),
  description: z.string().optional(),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  amenities: z.array(z.enum(["WATER", "INTERNET", "ACCESSIBLE"])).default([]),
  capacity: z.number().int().positive(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

const partialShelterSchema = shelterSchema.partial();

router.get("/", async (_req: Request, res: Response) => {
  const shelters = await prisma.shelter.findMany({ orderBy: { name: "asc" } });
  res.json(shelters);
});

const nearestQuery = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

router.get("/nearest", async (req: Request, res: Response) => {
  const parsed = nearestQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { lat, lng, limit } = parsed.data;
  const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT id, name, slug, type, description, address, lat, lng, amenities, capacity, "photoUrl", status, ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance_m FROM shelters ORDER BY geom <-> ST_SetSRID(ST_MakePoint($1, $2), 4326) LIMIT $3`,
    lng, lat, limit
  );
  const parsedRows = rows.map((r) => ({
    ...r,
    amenities: typeof r.amenities === "string"
      ? r.amenities.replace(/[{}]/g, "").split(",").filter(Boolean)
      : r.amenities,
  }));
  res.json(parsedRows);
});

router.get("/:id", async (req: Request, res: Response) => {
  const shelter = await prisma.shelter.findUnique({ where: { id: getId(req) } });
  if (!shelter) {
    res.status(404).json({ error: "Shelter not found" });
    return;
  }
  res.json(shelter);
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const parsed = shelterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const slug = slugify(parsed.data.name);

  const shelter = await prisma.shelter.create({
    data: { ...parsed.data, slug },
  });
  res.status(201).json(shelter);
});

router.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = getId(req);
  const existing = await prisma.shelter.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Shelter not found" });
    return;
  }

  const parsed = partialShelterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const data: any = { ...parsed.data };
  if (data.name) {
    data.slug = slugify(data.name);
  }

  const shelter = await prisma.shelter.update({ where: { id }, data });
  res.json(shelter);
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = getId(req);
  const existing = await prisma.shelter.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Shelter not found" });
    return;
  }

  await prisma.shelter.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
