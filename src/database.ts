import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "192.168.0.110",
    user: process.env.DB_USER || "theclock",
    password: process.env.DB_PASSWORD || "J15m06..!",
    database: process.env.DB_NAME || "the_clock",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
