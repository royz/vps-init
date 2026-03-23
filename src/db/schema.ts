import { sqliteTable } from "drizzle-orm/sqlite-core";
import { uuid } from "fastv7";
import { encryptedData } from "./custom";

const MINUTE = 60_000;

export const configs = sqliteTable("configs", (t) => ({
	id: t.text().primaryKey().$defaultFn(uuid),
	secrets: encryptedData().notNull(),
	secretsExpiryDeadline: t
		.integer({ mode: "timestamp_ms" })
		.notNull()
		.$onUpdateFn(() => new Date(Date.now() + 15 * MINUTE)), // move the deadline each time any value is saved
	secretsExpiredAt: t.integer({ mode: "timestamp_ms" }), // put the timestamp when the secrets are removed
	createdAt: t
		.integer({ mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: t
		.integer({ mode: "timestamp_ms" })
		.notNull()
		.$onUpdateFn(() => new Date()),
}));
