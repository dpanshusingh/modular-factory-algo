import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) throw new Error("PORT is not defined");
if (!process.env.CORS_ORIGIN) throw new Error("CORS_ORIGIN is not defined");
if (!process.env.DB_USER) throw new Error("DB_USER is not defined");
if (!process.env.DB_HOST) throw new Error("DB_HOST is not defined");
if (!process.env.DB_NAME) throw new Error("DB_NAME is not defined");
if (!process.env.DB_PASS) throw new Error("DB_PASS is not defined");
if (!process.env.DB_PORT) throw new Error("DB_PORT is not defined");

export const ENV = {
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASS: process.env.DB_PASS,
    DB_PORT: process.env.DB_PORT,
};
