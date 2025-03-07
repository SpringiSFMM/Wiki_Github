import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

// Verwende Umgebungsvariablen oder Fallback auf hartcodierte Werte
const pool = mysql.createPool({
  host: 'db.pavl21.de',
  port: 3306,
  user: 'u1962_PSzSyNxsln',
  password: 'diS.2n=jbGuR^4aJfKC7V.XS',
  database: process.env.DB_NAME || 's1962_cytooxien_wiki',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };