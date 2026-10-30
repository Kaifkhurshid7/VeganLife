// Applies supabase/migrations/*.sql to the database in SUPABASE_DB_URL, in order,
// once each (tracked in public.schema_migrations). No Supabase CLI required:
//   npm run db:migrate
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb, query, tx, closeDb } from '../src/db/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '../../supabase/migrations');

await initDb();
await query(`create table if not exists public.schema_migrations (
  version text primary key,
  applied_at timestamptz not null default now()
)`);
await query('alter table public.schema_migrations enable row level security');

const done = new Set((await query('select version from public.schema_migrations')).rows.map((r) => r.version));
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
let applied = 0;

for (const file of files) {
  const version = file.replace(/\.sql$/, '');
  if (done.has(version)) {
    console.log(`  skip   ${version}`);
    continue;
  }
  const sql = fs.readFileSync(path.join(dir, file), 'utf8');
  await tx(async (t) => {
    await t.query(sql);
    await t.query('insert into public.schema_migrations (version) values ($1)', [version]);
  });
  console.log(`  apply  ${version}`);
  applied += 1;
}

console.log(applied ? `Done: ${applied} migration(s) applied.` : 'Database is up to date.');
await closeDb();
