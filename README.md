# VPS Init

VPS Init is a lightweight Cloudflare-hosted web app that generates a tailored Bash script for bootstrapping a fresh Linux VPS.

The app is fully client-side only. There is no backend server or API for storing configs or retrieving scripts.

Current OS support is Ubuntu/Debian only.

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
- Set timezone (defaults to UTC)
- Enable unattended security upgrades
- Create a new sudo user
- Change SSH port
- Disable root login
- Add `authorized_keys` to the new user
- Disable password authentication
- Install and configure Fail2Ban
- Enable firewall with UFW
- Set up system-level environment variables
- Install, configure, and authenticate Tailscale
- Install reverse proxy (Nginx or Caddy)
- Create a swap file with custom size
- Set up zsh with oh-my-zsh, zoxide, and command suggestions
- Safer rerun behavior and idempotency markers

### Optional Installs

- `fnm` and latest LTS Node.js
- `uv` and Python
- Docker and Compose
- Doppler
- Useful utilities: `curl`, `wget`, `git`, `vim`, `nano`, `htop`, `btop`, `tmux`, `screen`, `build-essential`, `jq`, `ripgrep`, `unzip`, `zip`, `net-tools`, `dnsutils`, `ncdu`, `tree`, `mtr`

