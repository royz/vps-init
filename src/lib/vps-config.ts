export interface VpsConfig {
	// System
	updatePackages: boolean;
	hostname: string;
	timezone: string;

	// User
	username: string;
	userPassword: string; // sensitive – never send to backend or URL

	// SSH
	sshAuthorizedKeys: string;
	sshHardening: boolean;
	disableRootLogin: boolean;
	disablePasswordAuth: boolean;
	sshPort: number;

	// Security
	firewallEnabled: boolean;
	firewallExtraPorts: string[];
	fail2banEnabled: boolean;
	unattendedUpgradesEnabled: boolean;

	// System tuning
	swapEnabled: boolean;
	swapSize: string;

	// Utilities
	baselineUtilities: boolean;

	// Node.js
	nodejsEnabled: boolean;
	nodejsVersion: string;

	// Python
	uvEnabled: boolean;
	installLatestPython: boolean;

	// Docker
	dockerEnabled: boolean;
	dockerComposeEnabled: boolean;
	dockerClientTools: boolean;

	// Reverse proxy
	reverseProxy: "none" | "caddy" | "nginx";

	// Tailscale
	tailscaleEnabled: boolean;
	tailscaleAuthKey: string; // sensitive – never send to backend or URL
	tailscaleAdvertiseExitNode: boolean;

	// Shell
	zshEnabled: boolean;
	ohMyZshEnabled: boolean;
	shellTheme: string;
	zshAutosuggestions: boolean;
	zoxideEnabled: boolean;

	// Doppler
	dopplerEnabled: boolean;
}

export const DEFAULT_CONFIG: VpsConfig = {
	updatePackages: true,
	hostname: "",
	timezone: "UTC",

	username: "",
	userPassword: "",

	sshAuthorizedKeys: "",
	sshHardening: true,
	disableRootLogin: true,
	disablePasswordAuth: true,
	sshPort: 22,

	firewallEnabled: true,
	firewallExtraPorts: [],
	fail2banEnabled: true,
	unattendedUpgradesEnabled: true,

	swapEnabled: true,
	swapSize: "2G",

	baselineUtilities: true,

	nodejsEnabled: true,
	nodejsVersion: "lts",

	uvEnabled: true,
	installLatestPython: true,

	dockerEnabled: false,
	dockerComposeEnabled: true,
	dockerClientTools: false,

	reverseProxy: "caddy",

	tailscaleEnabled: false,
	tailscaleAuthKey: "",
	tailscaleAdvertiseExitNode: false,

	zshEnabled: true,
	ohMyZshEnabled: true,
	shellTheme: "avit",
	zshAutosuggestions: true,
	zoxideEnabled: true,

	dopplerEnabled: false,
};

export const TIMEZONES = [
	"UTC",
	"America/New_York",
	"America/Chicago",
	"America/Denver",
	"America/Los_Angeles",
	"America/Toronto",
	"America/Vancouver",
	"America/Sao_Paulo",
	"America/Buenos_Aires",
	"Europe/London",
	"Europe/Paris",
	"Europe/Berlin",
	"Europe/Madrid",
	"Europe/Rome",
	"Europe/Amsterdam",
	"Europe/Stockholm",
	"Europe/Warsaw",
	"Europe/Moscow",
	"Europe/Istanbul",
	"Africa/Cairo",
	"Africa/Johannesburg",
	"Africa/Lagos",
	"Asia/Dubai",
	"Asia/Kolkata",
	"Asia/Dhaka",
	"Asia/Bangkok",
	"Asia/Singapore",
	"Asia/Shanghai",
	"Asia/Tokyo",
	"Asia/Seoul",
	"Australia/Sydney",
	"Australia/Melbourne",
	"Pacific/Auckland",
	"Pacific/Honolulu",
];

export const NODE_VERSIONS = [
	{ value: "lts", label: "LTS" },
	{ value: "24", label: "24" },
	{ value: "22", label: "22" },
	{ value: "21", label: "21" },
	{ value: "20", label: "20" },
	{ value: "18", label: "18" },
	{ value: "latest", label: "Latest" },
];

export const SWAP_SIZES = [
	{ value: "512M", label: "512 MB" },
	{ value: "1G", label: "1 GB" },
	{ value: "2G", label: "2 GB" },
	{ value: "4G", label: "4 GB" },
	{ value: "8G", label: "8 GB" },
];

export const SHELL_THEMES = [
	{ value: "avit", label: "avit" },
	{ value: "robbyrussell", label: "robbyrussell" },
	{ value: "agnoster", label: "agnoster" },
	{ value: "bira", label: "bira" },
	{ value: "bureau", label: "bureau" },
	{ value: "clean", label: "clean" },
	{ value: "half-life", label: "half-life" },
	{ value: "jonathan", label: "jonathan" },
	{ value: "ys", label: "ys" },
];
