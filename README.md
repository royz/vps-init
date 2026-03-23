# VPS Init

VPS Init is a lightweight Cloudflare-hosted web app that generates a tailored Bash script for bootstrapping a fresh Linux VPS, with shareable non-secret config in query params and short-lived token-based script retrieval.

## Setup

1. Install dependencies:

	```bash
	pnpm install
	```

2. Create your local environment file from the example:

	```bash
	copy .env.example .env
	```

	Set `ENCRYPTION_KEY` in `.env` to a strong random value.

3. Set up your Cloudflare Wrangler config.

	If you want to start from the template, copy the example config into your local Wrangler config file:

	```bash
	copy wrangler.jsonc.example wrangler.jsonc
	```

	Then update the copied `wrangler.jsonc` with your own Cloudflare values:

	- Run `wrangler login` if you are not already authenticated.
	- Run `wrangler whoami` to find your Cloudflare account ID, then set `account_id`.
	- Run `wrangler d1 create vps-init` to create the D1 database.
	- When Wrangler asks whether it should add the database to your config automatically, answer `Y`.
	- Use `DB` as the binding name, since that is what the app expects.
	- If you choose a different binding name, update the code to match.

4. Generate Cloudflare types after the config is in place:

	```bash
	pnpm cf-typegen
	```

5. Start the local dev server:

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
- Store shareable non-secret config in query params
- Store full config temporarily for about 15 minutes
- Generate a short-lived token for direct `curl`-based script execution
