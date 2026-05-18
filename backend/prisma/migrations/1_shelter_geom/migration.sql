ALTER TABLE shelters ADD COLUMN geom geography(Point, 4326);
UPDATE shelters SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326);
CREATE INDEX shelters_geom_idx ON shelters USING GIST (geom);
CREATE OR REPLACE FUNCTION shelters_update_geom() RETURNS trigger AS $$ BEGIN NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER shelters_geom_trigger BEFORE INSERT OR UPDATE OF lat, lng ON shelters FOR EACH ROW EXECUTE FUNCTION shelters_update_geom();
