import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$executeRawUnsafe(
      "CREATE INDEX IF NOT EXISTS shelters_geom_idx ON shelters USING GIST (geom)"
    );
    console.log("geom index OK");
  } catch (e: any) {
    console.log("geom index: " + e.message);
  }

  try {
    await prisma.$executeRawUnsafe(
      "CREATE OR REPLACE FUNCTION shelters_update_geom() RETURNS trigger AS $$ BEGIN NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326); RETURN NEW; END; $$ LANGUAGE plpgsql"
    );
    await prisma.$executeRawUnsafe(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'shelters_geom_trigger') THEN CREATE TRIGGER shelters_geom_trigger BEFORE INSERT OR UPDATE OF lat, lng ON shelters FOR EACH ROW EXECUTE FUNCTION shelters_update_geom(); END IF; END $$`
    );
    console.log("geom trigger OK");
  } catch (e: any) {
    console.log("geom trigger: " + e.message);
  }

  await prisma.$disconnect();
}

main();
