import { customType } from "drizzle-orm/sqlite-core";
import { decrypt, encrypt } from "#/lib/encryption";

export type Secrets = {
	tailscaleToken?: string;
	dopplerToken?: string;
	newUsername?: string;
	newUserPassword?: string;
};

export const encryptedData = customType<{
	data: Secrets;
	driverData: string;
}>({
	dataType() {
		return "text";
	},
	toDriver(value) {
		return encrypt(value);
	},
	fromDriver(value) {
		return decrypt<Secrets>(value);
	},
});
