import { Pool } from "pg";
import dotenv from "dotenv";
import { ENV } from "./envConfig";
dotenv.config();

export const pool = new Pool({
    user: ENV.DB_USER,
    host: ENV.DB_HOST,
    database: ENV.DB_NAME,
    password: ENV.DB_PASS,
    port: Number(ENV.DB_PORT) || 5432,
    ssl: {
        rejectUnauthorized: false, // required if using public IP
    },
});

// Function to test connection
export async function connectDB() {
    try {
        const client = await pool.connect();
        console.log("✅ PostgreSQL connected successfully!");
        client.release();
    } catch (err) {
        console.error("❌ Error connecting to PostgreSQL:", err);
        process.exit(1);
    }
}
