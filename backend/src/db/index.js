import pg from 'pg';
import { logger } from '../utils/logger.js';

// COUNT(*) and identity columns are bigint; pg returns them as strings by
// default. They are far below 2^53, so plain numbers are safe and friendlier.
pg.types.setTypeParser(20, (v) => Number(v));

/**
 * One tiny interface for the whole app:
 *   query(text, params) -> { rows, rowCount }
 *   tx(async (t) => { await t.query(...) })   // BEGIN / COMMIT / ROLLBACK
 *
 * Production uses a pooled pg connection to Supabase. Tests set DB_DRIVER=pglite
 * to run the same SQL against an in-process Postgres.
 */
let impl = null;

function connectionString() {
  const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'No database configured. Set SUPABASE_DB_URL in backend/.env (Supabase dashboard > Connect > '
      + 'Connection string, with your database password filled in).'
    );
  }
  if (url.includes('[YOUR-PASSWORD]')) {
    throw new Error('SUPABASE_DB_URL still contains [YOUR-PASSWORD]. Replace it with your real database password.');
  }
  return url;
}

function createPgImpl() {
  const url = connectionString();
  const host = new URL(url).hostname;
  // Supabase requires TLS. Its certificates chain to Supabase's own CA, which Node
  // does not trust by default, so verify=false is the documented client setting.
  const useSsl = /supabase\.(co|com)$/.test(host) || /sslmode=require/.test(url);

  const pool = new pg.Pool({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Client-side ceiling so one slow query can never hang a request forever
    query_timeout: 15_000,
  });
  pool.on('error', (err) => logger.error('Postgres pool error', { message: err.message }));

  return {
    pool,
    query: (text, params) => pool.query(text, params),
    async tx(fn) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn({ query: (text, params) => client.query(text, params) });
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    },
    close: () => pool.end(),
  };
}

export async function initDb() {
  if (impl) return impl;
  if (process.env.DB_DRIVER === 'pglite') {
    const { createPgliteImpl } = await import('./pglite.js');
    impl = await createPgliteImpl();
  } else {
    impl = createPgImpl();
  }
  // Fail fast with a readable message if the connection or credentials are wrong
  await impl.query('select 1');
  return impl;
}

export const query = (text, params) => {
  if (!impl) throw new Error('Database not initialised. Call initDb() first.');
  return impl.query(text, params);
};

export const tx = (fn) => {
  if (!impl) throw new Error('Database not initialised. Call initDb() first.');
  return impl.tx(fn);
};

export const closeDb = async () => {
  if (impl) {
    await impl.close?.();
    impl = null;
  }
};

/** First row or null */
export async function one(text, params) {
  const { rows } = await query(text, params);
  return rows[0] || null;
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v) => typeof v === 'string' && UUID_RE.test(v);
