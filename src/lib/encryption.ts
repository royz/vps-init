import { env } from "cloudflare:workers";
import SuperJSON from "superjson";

const AES_GCM_IV_LENGTH = 12;
const AES_GCM_KEY_LENGTH = 32;
const BASE64_CHUNK_SIZE = 0x8000;

function decodeBase64(value: string, errorMessage: string): Uint8Array {
	const normalized = value.trim().replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
	let binary: string;

	try {
		binary = atob(padded);
	} catch {
		throw new Error(errorMessage);
	}

	const bytes = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index++) {
		bytes[index] = binary.charCodeAt(index);
	}

	return bytes;
}

function decodeBase64Key(value: string): ArrayBuffer {
	const bytes = decodeBase64(value, "ENCRYPTION_KEY must be valid base64.");

	if (bytes.length !== AES_GCM_KEY_LENGTH) {
		throw new Error("ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
	}

	const buffer = new ArrayBuffer(bytes.byteLength);
	new Uint8Array(buffer).set(bytes);
	return buffer;
}

function encodeBase64(bytes: Uint8Array): string {
	let binary = "";

	for (let index = 0; index < bytes.length; index += BASE64_CHUNK_SIZE) {
		binary += String.fromCharCode(
			...bytes.subarray(index, index + BASE64_CHUNK_SIZE),
		);
	}

	return btoa(binary);
}

async function importEncryptionKey(
	keyUsages: readonly KeyUsage[],
): Promise<CryptoKey> {
	return crypto.subtle.importKey(
		"raw",
		decodeBase64Key(env.ENCRYPTION_KEY),
		{ name: "AES-GCM" },
		false,
		keyUsages,
	);
}

export async function encrypt(value: unknown): Promise<string> {
	const plainText = SuperJSON.stringify({ value });
	const encoder = new TextEncoder();
	const data = encoder.encode(plainText);
	const key = await importEncryptionKey(["encrypt"]);
	const iv = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_LENGTH));

	const encrypted = await crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv: iv,
		},
		key,
		data,
	);
	const encryptedArray = new Uint8Array(encrypted);
	const combined = new Uint8Array(iv.length + encryptedArray.length);
	combined.set(iv);
	combined.set(encryptedArray, iv.length);
	return encodeBase64(combined);
}

export async function decrypt<T = unknown>(encryptedValue: string): Promise<T> {
	const combined = decodeBase64(
		encryptedValue,
		"Encrypted payload must be valid base64.",
	);

	if (combined.length <= AES_GCM_IV_LENGTH) {
		throw new Error("Encrypted payload is malformed.");
	}

	const iv = combined.slice(0, AES_GCM_IV_LENGTH);
	const ciphertext = combined.slice(AES_GCM_IV_LENGTH);
	const key = await importEncryptionKey(["decrypt"]);
	const decrypted = await crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv,
		},
		key,
		ciphertext,
	);
	const decoder = new TextDecoder();
	const plainText = decoder.decode(decrypted);
	const parsed = SuperJSON.parse<{ value: T }>(plainText);

	return parsed.value;
}
