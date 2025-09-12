import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool: mysql.Pool;

export async function initDb() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  // test connection
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('MySQL pool created');
  return pool;
}

export function getPool() {
  if (!pool) throw new Error('Pool not initialized. Call initDb() first.');
  return pool;
}
