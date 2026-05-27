ALTER TABLE shelters ADD COLUMN IF NOT EXISTS geom geography(Point, 4326);
UPDATE shelters SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326) WHERE geom IS NULL;
CREATE INDEX IF NOT EXISTS shelters_geom_idx ON shelters USING GIST (geom);
CREATE OR REPLACE FUNCTION shelters_update_geom() RETURNS trigger AS $$ BEGIN NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326); RETURN NEW; END; $$ LANGUAGE plpgsql;
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'shelters_geom_trigger') THEN CREATE TRIGGER shelters_geom_trigger BEFORE INSERT OR UPDATE OF lat, lng ON shelters FOR EACH ROW EXECUTE FUNCTION shelters_update_geom(); END IF; END $$;
