import mysql, { Pool } from 'mysql2'
import 'dotenv/config';

export const pool:Pool = mysql.createPool({
  host: process.env.SQL_ENDPOINT,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB
})
