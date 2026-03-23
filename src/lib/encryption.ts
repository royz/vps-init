import { env } from "cloudflare:workers";
import { createCipheriv, createDecipheriv } from "node:crypto";
import SuperJSON from "superjson";

const AES_GCM_IV_LENGTH = 12;
const AES_GCM_KEY_LENGTH = 32;
const AES_GCM_TAG_LENGTH = 16;

function decodeBase64(value: string, errorMessage: string): Buffer {
	const normalized = value.trim().replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

	try {
		return Buffer.from(padded, "base64");
	} catch {
		throw new Error(errorMessage);
	}
}

function getEncryptionKey(): Buffer {
	const key = decodeBase64(
		env.ENCRYPTION_KEY,
		"ENCRYPTION_KEY must be valid base64.",
	);

	if (key.length !== AES_GCM_KEY_LENGTH) {
		throw new Error("ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
	}

	return key;
}

export function encrypt(value: unknown): string {
	const plainText = SuperJSON.stringify({ value });
	const iv = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_LENGTH));
	const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
	const encrypted = Buffer.concat([
		cipher.update(plainText, "utf8"),
		cipher.final(),
	]);
	const tag = cipher.getAuthTag();

	return Buffer.concat([Buffer.from(iv), encrypted, tag]).toString("base64");
}

export function decrypt<T = unknown>(encryptedValue: string): T {
	const combined = decodeBase64(
		encryptedValue,
		"Encrypted payload must be valid base64.",
	);

	if (combined.length <= AES_GCM_IV_LENGTH + AES_GCM_TAG_LENGTH) {
		throw new Error("Encrypted payload is malformed.");
	}

	const iv = combined.subarray(0, AES_GCM_IV_LENGTH);
	const ciphertext = combined.subarray(
		AES_GCM_IV_LENGTH,
		combined.length - AES_GCM_TAG_LENGTH,
	);
	const tag = combined.subarray(combined.length - AES_GCM_TAG_LENGTH);
	const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
	decipher.setAuthTag(tag);

	const plainText = Buffer.concat([
		decipher.update(ciphertext),
		decipher.final(),
	]).toString("utf8");
	const parsed = SuperJSON.parse<{ value: T }>(plainText);

	return parsed.value;
}
