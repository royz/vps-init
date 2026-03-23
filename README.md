# VPS Init

VPS Init is a lightweight Cloudflare-hosted web app that generates a tailored Bash script for bootstrapping a fresh Linux VPS, with shareable non-secret config in query params and short-lived token-based script retrieval.

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
