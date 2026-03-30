import type { VpsConfig } from "./vps-config";

/** Extract just the auth key from either a bare token or a full install command. */
function parseTailscaleKey(raw: string): string {
	// --auth-key=VALUE or --authkey=VALUE (with optional quotes)
	const match = raw.match(/--auth(?:-)?key[= ](["']?)([\w:-]+)\1/);
	if (match) return match[2];
	// Bare token: starts with tskey-
	const trimmed = raw.trim();
	if (/^tskey-/.test(trimmed)) return trimmed;
	return "";
}

function sectionHeader(title: string): string {
	const bar = `# ${"─".repeat(58)}`;
	return `${bar}\n# ${title}\n${bar}`;
}

function block(title: string, lines: string[]): string {
	const filtered = lines.filter((l) => l !== null && l !== undefined);
	if (filtered.length === 0) return "";
	return `${sectionHeader(title)}\n\n${filtered.join("\n")}\n`;
}

export function buildScript(config: VpsConfig): string {
	const generated = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const sections: string[] = [];

	// ── Shebang & header ─────────────────────────────────────
	sections.push(`#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════
# VPS Init — Bootstrap Script
# Generated: ${generated}
# ════════════════════════════════════════════════════════════
# Review this script carefully before running.
# Run as root or with: sudo bash <script>
# Tested against: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS
# ════════════════════════════════════════════════════════════

set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
TARGET_USER="${config.username.trim()}"
[ -z "$TARGET_USER" ] && { echo "❌  TARGET_USER is not set — set a username before running this script."; exit 1; }

echo ""
echo "┌──────────────────────────────────────────────────────────┐"
echo "│             VPS Init — Bootstrap Starting                │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""`);

	// ── System update ────────────────────────────────────────
	if (config.updatePackages) {
		sections.push(
			block("System Update & Upgrade", [
				'echo "→ Updating system packages..."',
				"apt-get update -y",
				"apt-get upgrade -y",
				"apt-get autoremove -y",
				'echo "✓ System updated."',
			]),
		);
	}

	// ── Hostname ─────────────────────────────────────────────
	if (config.hostname.trim()) {
		sections.push(
			block("Hostname", [
				`HOSTNAME="${config.hostname.trim()}"`,
				'echo "→ Setting hostname to: $HOSTNAME"',
				'hostnamectl set-hostname "$HOSTNAME"',
				'if ! grep -q "$HOSTNAME" /etc/hosts; then',
				'  echo "127.0.1.1 $HOSTNAME" >> /etc/hosts',
				"fi",
				'echo "✓ Hostname configured."',
			]),
		);
	}

	// ── Timezone ─────────────────────────────────────────────
	if (config.timezone) {
		sections.push(
			block("Timezone", [
				`TIMEZONE="${config.timezone}"`,
				'echo "→ Setting timezone to: $TIMEZONE"',
				'timedatectl set-timezone "$TIMEZONE"',
				'echo "✓ Timezone set."',
			]),
		);
	}

	// ── Create sudo user ─────────────────────────────────────
	if (config.username.trim()) {
		const lines: string[] = [
			'echo "→ Setting up user: $TARGET_USER"',
			'if id "$TARGET_USER" &>/dev/null; then',
			'  echo "  User $TARGET_USER already exists — skipping creation."',
			"else",
			'  useradd -m -s /bin/bash "$TARGET_USER"',
			config.userPassword
				? `  echo "$TARGET_USER:${config.userPassword}" | chpasswd  # ⚠ Change this password after first login`
				: `  # ⚠ No password set — run: passwd ${config.username.trim()}`,
			'  usermod -aG sudo "$TARGET_USER"',
			'  echo "✓ User $TARGET_USER created with sudo access."',
			"fi",
		];

		if (config.sshAuthorizedKeys.trim()) {
			lines.push(
				"",
				'SSH_DIR="/home/$TARGET_USER/.ssh"',
				'mkdir -p "$SSH_DIR"',
				`cat >> "$SSH_DIR/authorized_keys" << 'SSHKEYS'`,
				config.sshAuthorizedKeys.trim(),
				"SSHKEYS",
				'chmod 700 "$SSH_DIR"',
				'chmod 600 "$SSH_DIR/authorized_keys"',
				'chown -R "$TARGET_USER:$TARGET_USER" "$SSH_DIR"',
				'echo "✓ SSH authorized keys installed."',
			);
		}

		sections.push(block("Create Sudo User", lines));
	}

	// ── SSH hardening ─────────────────────────────────────────
	if (config.sshHardening) {
		const lines: string[] = [
			"# ⚠ CAUTION: Ensure you have a working login method before applying.",
			'echo "→ Hardening SSH configuration..."',
			'SSHD_CONFIG="/etc/ssh/sshd_config"',
			"",
		];

		if (config.sshPort !== 22) {
			lines.push(
				`# Change SSH port to ${config.sshPort}`,
				`sed -i 's/^#*Port .*/Port ${config.sshPort}/' "$SSHD_CONFIG"`,
				`grep -q '^Port ' "$SSHD_CONFIG" || echo 'Port ${config.sshPort}' >> "$SSHD_CONFIG"`,
				"",
			);
		}

		if (config.disableRootLogin) {
			lines.push(
				"sed -i 's/^#*PermitRootLogin .*/PermitRootLogin no/' \"$SSHD_CONFIG\"",
				"grep -q '^PermitRootLogin ' \"$SSHD_CONFIG\" || echo 'PermitRootLogin no' >> \"$SSHD_CONFIG\"",
				"",
			);
		}

		if (config.disablePasswordAuth) {
			lines.push(
				"# Requires SSH keys to be already installed before enabling",
				"sed -i 's/^#*PasswordAuthentication .*/PasswordAuthentication no/' \"$SSHD_CONFIG\"",
				"grep -q '^PasswordAuthentication ' \"$SSHD_CONFIG\" || echo 'PasswordAuthentication no' >> \"$SSHD_CONFIG\"",
				"",
			);
		}

		lines.push(
			"# Ubuntu 22.04+ uses 'ssh', older distros use 'sshd'",
			"systemctl restart ssh 2>/dev/null || systemctl restart sshd",
			'echo "✓ SSH hardened."',
		);
		sections.push(block("SSH Hardening", lines));
	}

	// ── Firewall (UFW) ────────────────────────────────────────
	if (config.firewallEnabled) {
		const sshPort =
			config.sshHardening && config.sshPort !== 22 ? config.sshPort : 22;
		const lines: string[] = [
			'echo "→ Configuring UFW firewall..."',
			"apt-get install -y ufw",
			"",
			"ufw default deny incoming",
			"ufw default allow outgoing",
			"",
			`ufw allow ${sshPort}/tcp comment 'SSH'`,
		];

		if (config.reverseProxy === "caddy" || config.reverseProxy === "nginx") {
			lines.push(
				"ufw allow 80/tcp  comment 'HTTP'",
				"ufw allow 443/tcp comment 'HTTPS'",
			);
		}

		if (config.tailscaleEnabled) {
			lines.push("ufw allow in on tailscale0 comment 'Tailscale'");
		}

		for (const port of config.firewallExtraPorts) {
			lines.push(`ufw allow ${port} comment 'Custom'`);
		}

		lines.push(
			"",
			"ufw --force enable",
			"ufw status verbose",
			'echo "✓ Firewall enabled."',
		);
		sections.push(block("Firewall (UFW)", lines));
	}

	// ── Fail2ban ──────────────────────────────────────────────
	if (config.fail2banEnabled) {
		sections.push(
			block("Fail2ban", [
				'echo "→ Installing fail2ban..."',
				"apt-get install -y fail2ban",
				"",
				"cat > /etc/fail2ban/jail.local << 'EOF'",
				"[DEFAULT]",
				"bantime  = 3600",
				"findtime = 600",
				"maxretry = 5",
				"backend  = systemd",
				"",
				"[sshd]",
				"enabled = true",
				"EOF",
				"",
				"systemctl enable --now fail2ban",
				'echo "✓ Fail2ban installed and active."',
			]),
		);
	}

	// ── Unattended upgrades ───────────────────────────────────
	if (config.unattendedUpgradesEnabled) {
		sections.push(
			block("Unattended Security Upgrades", [
				'echo "→ Enabling automatic security updates..."',
				"apt-get install -y unattended-upgrades apt-listchanges",
				"dpkg-reconfigure -plow unattended-upgrades",
				'echo "✓ Unattended upgrades enabled."',
			]),
		);
	}

	// ── Swap ──────────────────────────────────────────────────
	if (config.swapEnabled) {
		sections.push(
			block(`Swap (${config.swapSize})`, [
				'echo "→ Configuring swap..."',
				'SWAP_FILE="/swapfile"',
				`SWAP_SIZE="${config.swapSize}"`,
				"",
				'if [ -f "$SWAP_FILE" ]; then',
				'  echo "  Swap file already exists — skipping."',
				"else",
				'  fallocate -l "$SWAP_SIZE" "$SWAP_FILE"',
				'  chmod 600 "$SWAP_FILE"',
				'  mkswap "$SWAP_FILE"',
				'  swapon "$SWAP_FILE"',
				'  echo "$SWAP_FILE none swap sw 0 0" >> /etc/fstab',
				'  echo "✓ Swap ($SWAP_SIZE) configured."',
				"fi",
				"",
				"# Optimize for server workloads",
				"sysctl -w vm.swappiness=10",
				"grep -q 'vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf",
			]),
		);
	}

	// ── Baseline utilities ────────────────────────────────────
	if (config.baselineUtilities) {
		sections.push(
			block("Baseline Utilities", [
				'echo "→ Installing baseline utilities..."',
				"apt-get install -y \\",
				"  curl wget git vim nano \\",
				"  htop btop tmux screen \\",
				"  build-essential ca-certificates gnupg lsb-release \\",
				"  jq ripgrep unzip zip \\",
				"  net-tools dnsutils ncdu tree mtr",
				'echo "✓ Baseline utilities installed."',
			]),
		);
	}

	// ── Node.js via fnm ───────────────────────────────────────
	if (config.nodejsEnabled) {
		const installArg =
			config.nodejsVersion === "lts"
				? "--lts"
				: config.nodejsVersion === "latest"
					? "--latest"
					: config.nodejsVersion;

		// fnm only accepts --lts/--latest for `install`, not for `use`/`default`.
		// After `fnm install --lts` the alias `lts-latest` is created automatically.
		// For explicit versions, use the version number directly.
		// For `latest`, no alias is created, so we resolve the version from fnm list.
		let useLines: string[];
		if (config.nodejsVersion === "lts") {
			useLines = ["fnm use lts-latest", "fnm default lts-latest"];
		} else if (config.nodejsVersion === "latest") {
			useLines = [
				"FNM_NODE_VER=$(fnm list | grep -oE 'v[0-9]+\\.[0-9]+\\.[0-9]+' | sort -V | tail -1)",
				'fnm use "$FNM_NODE_VER"',
				'fnm default "$FNM_NODE_VER"',
			];
		} else {
			useLines = [
				`fnm use ${config.nodejsVersion}`,
				`fnm default ${config.nodejsVersion}`,
			];
		}

		sections.push(
			block(`Node.js ${config.nodejsVersion} (via fnm)`, [
				`echo "→ Installing Node.js ${config.nodejsVersion} for $TARGET_USER (via fnm)..."`,
				`su - "$TARGET_USER" -s /bin/bash << 'NODESETUP'`,
				"set -euo pipefail",
				"curl -fsSL https://fnm.vercel.app/install | bash",
				'export FNM_PATH="$HOME/.local/share/fnm"',
				'export PATH="$FNM_PATH:$PATH"',
				'eval "$(fnm env --shell bash)"',
				`fnm install ${installArg}`,
				...useLines,
				"node --version",
				"npm --version",
				"NODESETUP",
				'echo "✓ Node.js installed."',
			]),
		);
	}

	// ── Python via uv ─────────────────────────────────────────
	if (config.uvEnabled) {
		const uvLines: string[] = [
			"set -euo pipefail",
			"curl -LsSf https://astral.sh/uv/install.sh | sh",
			'export PATH="$HOME/.local/bin:$PATH"',
			"uv --version",
		];

		if (config.installLatestPython) {
			uvLines.push(
				'echo "→ Installing latest Python via uv..."',
				"uv python install",
				"uv python list",
				'echo "✓ Python installed."',
			);
		}

		sections.push(
			block("Python (uv)", [
				'echo "→ Installing uv (Python package manager) for $TARGET_USER..."',
				`su - "$TARGET_USER" -s /bin/bash << 'UVSETUP'`,
				...uvLines,
				"UVSETUP",
				'echo "✓ uv installed."',
			]),
		);
	}

	// ── Docker ────────────────────────────────────────────────
	if (config.dockerEnabled) {
		const lines: string[] = [
			'echo "→ Installing Docker..."',
			"",
			"# Remove legacy packages",
			"for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do",
			"  apt-get remove -y $pkg 2>/dev/null || true",
			"done",
			"",
			"# Add Docker's official GPG key",
			"install -m 0755 -d /etc/apt/keyrings",
			"curl -fsSL https://download.docker.com/linux/ubuntu/gpg \\",
			"  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg",
			"chmod a+r /etc/apt/keyrings/docker.gpg",
			"",
			"echo \\",
			'  "deb [arch=$(dpkg --print-architecture) \\',
			"  signed-by=/etc/apt/keyrings/docker.gpg] \\",
			"  https://download.docker.com/linux/ubuntu \\",
			'  $(. /etc/os-release && echo $VERSION_CODENAME) stable" \\',
			"  | tee /etc/apt/sources.list.d/docker.list > /dev/null",
			"apt-get update -y",
			"",
		];

		const dockerPackages = ["docker-ce", "docker-ce-cli", "containerd.io"];
		if (config.dockerComposeEnabled)
			dockerPackages.push("docker-compose-plugin");
		if (config.dockerClientTools) dockerPackages.push("docker-buildx-plugin");

		lines.push(
			`apt-get install -y ${dockerPackages.join(" ")}`,
			"",
			"systemctl enable --now docker",
			"",
		);

		if (config.username.trim()) {
			lines.push('usermod -aG docker "$TARGET_USER"', "");
		}

		lines.push("docker --version", 'echo "✓ Docker installed."');
		sections.push(block("Docker", lines));
	}

	// ── Reverse proxy ─────────────────────────────────────────
	if (config.reverseProxy === "caddy") {
		sections.push(
			block("Caddy (Reverse Proxy)", [
				'echo "→ Installing Caddy..."',
				"apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl",
				"curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \\",
				"  | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg",
				"curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \\",
				"  | tee /etc/apt/sources.list.d/caddy-stable.list",
				"apt-get update -y",
				"apt-get install -y caddy",
				"",
				"systemctl enable --now caddy",
				"caddy version",
				'echo "✓ Caddy installed."',
			]),
		);
	} else if (config.reverseProxy === "nginx") {
		sections.push(
			block("Nginx (Reverse Proxy)", [
				'echo "→ Installing Nginx..."',
				"apt-get install -y nginx",
				"",
				"systemctl enable --now nginx",
				"nginx -v",
				'echo "✓ Nginx installed."',
			]),
		);
	}

	// ── Tailscale ─────────────────────────────────────────────
	if (config.tailscaleEnabled) {
		const authKey = parseTailscaleKey(config.tailscaleAuthKey);

		const lines: string[] = [
			'echo "→ Installing Tailscale..."',
			"curl -fsSL https://tailscale.com/install.sh | sh",
			"",
			"systemctl enable --now tailscaled",
		];

		if (config.tailscaleAdvertiseExitNode) {
			lines.push(
				"",
				"# Enable IP forwarding required for exit-node advertising",
				"grep -qF 'net.ipv4.ip_forward' /etc/sysctl.conf || echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf",
				"grep -qF 'net.ipv6.conf.all.forwarding' /etc/sysctl.conf || echo 'net.ipv6.conf.all.forwarding = 1' >> /etc/sysctl.conf",
				"sysctl -p",
			);
		}

		if (authKey) {
			const upFlags = [`--authkey="${authKey}"`, "--accept-routes"];
			if (config.tailscaleAdvertiseExitNode)
				upFlags.push("--advertise-exit-node");
			lines.push(
				"",
				"# Auth key provided — connecting automatically",
				`tailscale up ${upFlags.join(" ")}`,
				...(config.tailscaleAdvertiseExitNode
					? [
							"",
							"# ⚠ Approve this exit node in the Tailscale admin console:",
							"# https://login.tailscale.com/admin/machines",
						]
					: []),
			);
		} else {
			const manualFlags = ["--accept-routes"];
			if (config.tailscaleAdvertiseExitNode)
				manualFlags.push("--advertise-exit-node");
			lines.push(
				"",
				"# Run this after setup to connect:",
				`# tailscale up ${manualFlags.join(" ")}`,
				...(config.tailscaleAdvertiseExitNode
					? [
							"# ⚠ Then approve this exit node in the Tailscale admin console:",
							"# https://login.tailscale.com/admin/machines",
						]
					: []),
			);
		}

		lines.push("", "tailscale status || true", 'echo "✓ Tailscale installed."');
		sections.push(block("Tailscale (VPN)", lines));
	}

	// ── Zsh & Oh My Zsh ───────────────────────────────────────
	if (config.zshEnabled) {
		// Root-level: install zsh package + optional zoxide binary
		const rootLines: string[] = [
			'echo "→ Installing Zsh..."',
			"apt-get install -y zsh",
			'chsh -s "$(which zsh)" "$TARGET_USER"',
		];

		if (config.zoxideEnabled) {
			rootLines.push(
				"",
				'echo "→ Installing zoxide..."',
				"apt-get install -y zoxide 2>/dev/null || {",
				"  curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh",
				'  install -m 755 "$HOME/.local/bin/zoxide" /usr/local/bin/zoxide 2>/dev/null || true',
				"}",
			);
		}

		// User-context: everything that touches ~/.zshrc / ~/.oh-my-zsh
		const userLines: string[] = ["set -euo pipefail"];

		if (config.ohMyZshEnabled) {
			userLines.push(
				'echo "→ Installing Oh My Zsh..."',
				'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended',
			);

			if (config.shellTheme !== "robbyrussell") {
				userLines.push(
					`sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="${config.shellTheme}"/' ~/.zshrc`,
					`echo "  Theme set to: ${config.shellTheme}"`,
				);
			}

			if (config.zshAutosuggestions) {
				userLines.push(
					"",
					'echo "→ Installing zsh-autosuggestions & zsh-completions..."',
					"git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions",
					"git clone --depth=1 https://github.com/zsh-users/zsh-completions ~/.oh-my-zsh/custom/plugins/zsh-completions",
					"sed -i 's/^plugins=(\\(.*\\))/plugins=(\\1 zsh-autosuggestions zsh-completions)/' ~/.zshrc",
					'echo "✓ Autosuggestions & completions enabled."',
				);
			}
		}

		if (config.zoxideEnabled) {
			userLines.push(
				"",
				"grep -qF 'zoxide init zsh' ~/.zshrc || printf '\\neval \"$(zoxide init zsh)\"\\n' >> ~/.zshrc",
				'echo "✓ zoxide init added to ~/.zshrc"',
			);
		}

		// Inject fnm init into .zshrc (fnm was installed earlier as target user)
		if (config.nodejsEnabled) {
			userLines.push(
				"",
				"# Add fnm init to .zshrc if not already present",
				'if [ -f "$HOME/.local/share/fnm/fnm" ]; then',
				'  grep -qF \'fnm env\' ~/.zshrc 2>/dev/null || printf \'\\n# fnm\\nexport FNM_PATH="$HOME/.local/share/fnm"\\nexport PATH="$FNM_PATH:$PATH"\\neval "$(fnm env --shell zsh)"\\n\' >> ~/.zshrc',
				"fi",
			);
		}

		// Inject uv PATH into .zshrc (uv was installed earlier as target user)
		if (config.uvEnabled) {
			userLines.push(
				"",
				"# Add uv PATH to .zshrc if not already present",
				'if [ -f "$HOME/.local/bin/uv" ]; then',
				"  grep -qF '.local/bin' ~/.zshrc 2>/dev/null || printf '\\n# uv\\nexport PATH=\"$HOME/.local/bin:$PATH\"\\n' >> ~/.zshrc",
				"fi",
			);
		}

		rootLines.push(
			"",
			'echo "→ Configuring zsh for $TARGET_USER..."',
			`su - "$TARGET_USER" -s /bin/bash << 'ZSHSETUP'`,
			...userLines,
			"ZSHSETUP",
			"",
			`echo "✓ Zsh${config.ohMyZshEnabled ? " & Oh My Zsh" : ""} configured for $TARGET_USER."`,
		);
		sections.push(
			block(`Zsh${config.ohMyZshEnabled ? " & Oh My Zsh" : ""}`, rootLines),
		);
	}

	// ── Doppler ───────────────────────────────────────────────
	if (config.dopplerEnabled) {
		sections.push(
			block("Doppler (Secrets Manager)", [
				'echo "→ Installing Doppler CLI..."',
				"apt-get install -y apt-transport-https ca-certificates curl gnupg",
				"curl -sLf --retry 3 --tlsv1.2 --proto '=https' \\",
				"  'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' \\",
				"  | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg",
				'echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] \\',
				'  https://packages.doppler.com/public/cli/deb/debian any-version main" \\',
				"  | tee /etc/apt/sources.list.d/doppler-cli.list",
				"apt-get update -y",
				"apt-get install -y doppler",
				"",
				"doppler --version",
				"",
				"# Authenticate with: doppler login",
				"# Configure a project with: doppler setup",
				'echo "✓ Doppler installed."',
			]),
		);
	}

	// ── Footer ────────────────────────────────────────────────
	sections.push(`# ════════════════════════════════════════════════════════════

echo ""
echo "┌──────────────────────────────────────────────────────────┐"
echo "│          ✓ Bootstrap complete! Reboot recommended.       │"
echo "└──────────────────────────────────────────────────────────┘"
echo ""
`);

	return sections.filter(Boolean).join("\n");
}
