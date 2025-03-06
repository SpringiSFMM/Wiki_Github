import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'data.iwintra.net',
  port: 3306,
  user: 'u1962_PSzSyNxsln',
  password: 'PMAy.XOZuoMQVl=ocua5Hk.@',
  database: 's1962_cytooxien_wiki',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };