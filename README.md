# VPS Init

VPS Init is a lightweight Cloudflare-hosted web app that generates a tailored Bash script for bootstrapping a fresh Linux VPS, with shareable non-secret config in query params and short-lived token-based script retrieval.

## Setup

1. Install dependencies:

	```bash
	pnpm install
	```

2. Set up your Cloudflare Wrangler config.

	If you want to start from the template, copy the example config into your local Wrangler config file:

	```bash
	copy wrangler.jsonc.example wrangler.jsonc
	```

	Then update the copied `wrangler.jsonc` with your own Cloudflare values:

	- Run `wrangler login` if you are not already authenticated.
	- Run `wrangler whoami` to find your Cloudflare account ID, then set `account_id`.


3. Start the local dev server:

	```bash
	pnpm dev
	```

## Features

- Update and upgrade packages
- Change hostname
- Create a new sudo user
- SSH hardening
- Firewall setup
- unattended-upgrades
- fail2ban
- Swap setup
- Timezone configuration
- Baseline utility packages
- Install Node.js via `fnm`
- Choose the Node.js version to install
- Install `uv`
- Optionally install the latest Python version
- Install Docker
- Install Docker Compose
- Optionally install Docker client tools
- Reverse proxy install such as Caddy or Nginx
- Install Tailscale
- Optionally provide a Tailscale auth key for automatic login
- Install `zsh`
- Install `oh-my-zsh`
- Customize the shell prompt
- Install Doppler
- Optionally perform initial Doppler setup
- Safer rerun behavior and idempotency markers

