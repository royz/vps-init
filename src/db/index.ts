import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const db = drizzle<typeof schema>(env.DB, {
	schema,
	casing: "snake_case",
});
