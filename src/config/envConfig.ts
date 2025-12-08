import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

// Required environment variables
if (!process.env.PORT) throw new Error("PORT is not defined");
if (!process.env.CORS_ORIGIN) throw new Error("CORS_ORIGIN is not defined");

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
// Firebase environment variables (required for authentication)
if (!process.env.FIREBASE_PROJECT_ID)
  throw new Error("FIREBASE_PROJECT_ID is not defined");

if (!process.env.ORIGINS) throw new Error("ORIGINS is not defined");

if (!process.env.FIREBASE_PRIVATE_KEY)
  throw new Error("FIREBASE_PRIVATE_KEY is not defined");
if (!process.env.FIREBASE_CLIENT_EMAIL)
  throw new Error("FIREBASE_CLIENT_EMAIL is not defined");
if (!process.env.DATA_CONNECT_LOCATION)
  throw new Error("FIREBASE_REGION is not defined");
if (!process.env.DATA_CONNECT_CONNECTION_ID)
  throw new Error("DATA_CONNECT_CONNECTION_ID is not defined");

export const ENV = {
  // Server configuration
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ORIGINS: process.env.ORIGINS?.split(',').map(origin => origin.trim()) || [],
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database configuration
  DATABASE_URL: process.env.DATABASE_URL,

  // Firebase Admin SDK configuration
  FIREBASE: {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  },

  // Firebase Data Connect configuration
  DATACONNECT: {
    region: process.env.FIREBASE_REGION,
    connectionId: process.env.FIREBASE_DATACONNECT_CONNECTION_ID,
  },

  // LLM Configuration
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  LLM_MODEL: process.env.LLM_MODEL,
  LLM_TEMPERATURE: process.env.LLM_TEMPERATURE,
  LLM_MAX_TOKENS: process.env.LLM_MAX_TOKENS
};
