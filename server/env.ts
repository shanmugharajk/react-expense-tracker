import { z } from "zod";

let envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.string().transform(Number),
  DEFAULT_ADMIN_PASSWORD: z.string().optional().default("Admin@123"),
});

export let env = envSchema.parse(process.env);
