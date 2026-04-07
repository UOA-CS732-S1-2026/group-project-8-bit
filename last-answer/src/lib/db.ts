import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "./config";

export type Queryable = {
  query: <TRow extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ) => Promise<QueryResult<TRow>>;
};

declare global {
  var __oracleDbPool: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

function getPool() {
  if (global.__oracleDbPool) {
    return global.__oracleDbPool;
  }

  const pool = createPool();

  if (process.env.NODE_ENV !== "production") {
    global.__oracleDbPool = pool;
  }

  return pool;
}

export async function query<TRow extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return getPool().query<TRow>(text, params);
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
