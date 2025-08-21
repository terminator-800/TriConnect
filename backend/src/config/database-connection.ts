import dotenv from 'dotenv';
import mysql, { type Pool } from 'mysql2/promise';

dotenv.config();

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
