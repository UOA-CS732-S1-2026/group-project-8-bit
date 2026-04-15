CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_saves (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  save_id TEXT NOT NULL DEFAULT 'slot1',
  save_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, save_id)
);

ALTER TABLE player_saves
  ADD COLUMN IF NOT EXISTS save_id TEXT;

UPDATE player_saves
   SET save_id = 'slot1'
 WHERE save_id IS NULL;

ALTER TABLE player_saves
  ALTER COLUMN save_id SET DEFAULT 'slot1',
  ALTER COLUMN save_id SET NOT NULL;

DO $$
DECLARE
  primary_key_name TEXT;
  has_slot_primary_key BOOLEAN;
BEGIN
  SELECT con.conname
    INTO primary_key_name
    FROM pg_constraint con
   WHERE con.conrelid = 'player_saves'::regclass
     AND con.contype = 'p'
   LIMIT 1;

  SELECT EXISTS (
    SELECT 1
      FROM pg_constraint con
      JOIN LATERAL (
        SELECT array_agg(att.attname::text ORDER BY key_column.ordinality) AS column_names
          FROM unnest(con.conkey) WITH ORDINALITY AS key_column(attnum, ordinality)
          JOIN pg_attribute att
            ON att.attrelid = con.conrelid
           AND att.attnum = key_column.attnum
      ) key_columns ON TRUE
     WHERE con.conrelid = 'player_saves'::regclass
       AND con.contype = 'p'
       AND key_columns.column_names = ARRAY['user_id', 'save_id']
  )
    INTO has_slot_primary_key;

  IF primary_key_name IS NOT NULL AND NOT has_slot_primary_key THEN
    EXECUTE format('ALTER TABLE player_saves DROP CONSTRAINT %I', primary_key_name);
  END IF;

  IF NOT has_slot_primary_key THEN
    ALTER TABLE player_saves
      ADD CONSTRAINT player_saves_pkey PRIMARY KEY (user_id, save_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

