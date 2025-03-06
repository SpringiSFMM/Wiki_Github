import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

// Verwende Umgebungsvariablen oder Fallback auf hartcodierte Werte
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'data.iwintra.net',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'u1962_PSzSyNxsln',
  password: process.env.DB_PASSWORD || 'PMAy.XOZuoMQVl=ocua5Hk.@',
  database: process.env.DB_NAME || 's1962_cytooxien_wiki',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };