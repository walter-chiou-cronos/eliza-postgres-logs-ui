import { Pool } from "pg";

// Configure the PostgreSQL client
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function query<T = unknown>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
