import dotenv from "dotenv";

dotenv.config();

export const config = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5000", 10),
    isDev: process.env.NODE_ENV !== "production",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_super_secure_jwt_secret",
    expiration: process.env.JWT_EXPIRATION || "7d",
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET"];

if (process.env.NODE_ENV === "production") {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
}
