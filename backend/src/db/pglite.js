// In-process Postgres for tests (WebAssembly). Same SQL, no server needed.
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS = path.resolve(here, '../../../supabase/migrations');

// PGlite returns bigint columns as BigInt; the app expects plain numbers (as with pg)
function normalise(rows) {
  return rows.map((row) => {
    const out = {};
    for (const [k, v] of Object.entries(row)) out[k] = typeof v === 'bigint' ? Number(v) : v;
    return out;
  });
}

const wrap = (db) => ({
  async query(text, params) {
    const res = await db.query(text, params);
    return { rows: normalise(res.rows), rowCount: res.affectedRows ?? res.rows.length };
  },
});

export async function createPgliteImpl() {
  const db = new PGlite({ extensions: { pg_trgm } });
  await db.waitReady;
  for (const file of fs.readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort()) {
    await db.exec(fs.readFileSync(path.join(MIGRATIONS, file), 'utf8'));
  }
  const base = wrap(db);
  return {
    ...base,
    tx: (fn) => db.transaction(async (t) => fn(wrap(t))),
    close: () => db.close(),
  };
}
