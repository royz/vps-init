# AI Context

## Project Summary

This repository is for a lightweight web app that generates a tailor-made Bash script for bootstrapping a fresh Linux VPS.

The app should be hostable on Cloudflare and run entirely client-side with no backend server.

For now, generated scripts target Ubuntu/Debian systems only.

The current codebase is a minimal TanStack Start scaffold. The actual product behavior still needs to be built.

## Primary Goal

Help a user configure a set of VPS setup options in a web UI and generate a readable Bash script that they can review and run manually on a new server.

## Product Constraints

- Lightweight deployment
- Cloudflare-friendly hosting model
- Human-readable generated output
- Safe defaults with optional advanced sections
- Mantine-based UI
- Query-param sharing for non-secret config
- No backend persistence layer

## Core User Promise

"Give me a clean script for a fresh VPS without making me hand-write the same bootstrap steps every time."

## Target Features

### Required or Near-Term

- Update and upgrade packages
- Change hostname
- Set timezone (defaults to UTC)
- Enable unattended security upgrades
- Create a new sudo user
- Change SSH port
- Disable root login
- Add authorized keys to the new user
- Disable password authentication
- Install and configure Fail2Ban
- Enable firewall with UFW
- Set up system-level environment variables
- Install, configure, and authenticate Tailscale
- Install reverse proxy (Nginx or Caddy)
- Create a swap file with custom size
- Set up zsh with oh-my-zsh, zoxide, and command suggestions
- Optional installs:
	- `fnm` and latest LTS Node.js
	- `uv` and Python
	- Docker and Compose
	- Doppler
	- Useful utilities: `curl`, `wget`, `git`, `vim`, `nano`, `htop`, `btop`, `tmux`, `screen`, `build-essential`, `jq`, `ripgrep`, `unzip`, `zip`, `net-tools`, `dnsutils`, `ncdu`, `tree`, `mtr`
- Safer rerun behavior and idempotency markers

### Strong Candidates

- SSH authorized keys management
- Opinionated reverse proxy presets
- Basic monitoring hooks
- Backup reminders or snapshot workflow helpers

## Non-Goals

- Not a full server management platform
- Not any backend/API service for config or script storage
- Not a multi-user dashboard
- Not a secret storage system
- Not a general-purpose shell IDE

## Recommended Architecture

Prefer a small and explicit structure:

- A typed form model describing all selected setup options
- A validation layer for required and incompatible inputs
- A query-param serializer for all safe, non-secret options
- A secret-aware separation between shareable config and sensitive inputs
- A script builder that assembles Bash sections from typed options
- A preview panel that shows the generated script
- A copy/download action for the final output

Suggested internal split:

- UI form state
- URL sync for safe fields
- Secret input handling kept out of the URL
- Option schema and validation
- Script section generators
- Final script composer
- Small content/help layer for explaining each option

## Script Generation Rules

- Output must be easy to read
- Use clear section headers in the Bash script
- Prefer deterministic generation from structured inputs
- Avoid hidden side effects
- Keep commands explicit and reviewable
- Make optional steps easy to trace in the generated result
- Favor idempotent checks where practical
- If a step is risky, comment it clearly in the script
- Keep the generated output deterministic for a given config

## Security Guidance

- Do not store user secrets by default
- Non-secret state may go into query params, but secrets must never go there
- Do not assume the generated script will only run once
- Avoid unsafe curl-pipe patterns unless there is no reasonable alternative and the tradeoff is visible
- Make OS or distro assumptions explicit
- Prefer a non-root operational user after initial bootstrap

## UX Guidance

- The interface should feel focused and practical, not enterprise-heavy
- The entire UI should be built with Mantine components
- Users should understand what each toggle does without reading long docs
- Advanced options should be available without cluttering the default flow
- The generated script preview is a first-class part of the product
- Good defaults matter more than exposing every possible Linux tweak
- Sharing should feel native: bookmarkable URLs for safe settings while keeping secrets out of URLs

## Stack Context

Current stack seen in the repository:

- TanStack Start
- React 19
- TypeScript
- Vite
- Mantine should be the UI component system
- TanStack Router
- Biome

This is more infrastructure than the product likely needs today. Keep implementation simple unless a more complex abstraction is justified.

## Suggested Initial Milestones

1. Replace the placeholder landing page with a real product page.
2. Define the form schema for VPS setup options.
3. Implement the script builder from typed input.
4. Add a live preview panel.
5. Add copy and download actions.
6. Add field help, warnings, and validation.
7. Refine the visual design and mobile usability.

## Guidance For Future AI Work

When making changes in this repo:

- Preserve the lightweight product scope
- Prefer typed data models over ad hoc string concatenation
- Keep generated Bash readable and inspectable
- Do not overengineer with unnecessary backend layers
- If adding new VPS options, define both UX copy and exact script behavior
- Keep Cloudflare deployment constraints in mind
- Keep Mantine as the default UI system unless the user changes direction
- Keep shareable state and secret state separated by design
- Keep the app client-side only unless requirements explicitly change

## Single-Sentence Definition

VPS Init is a Cloudflare-hosted, client-side VPS bootstrap script generator with Mantine UI and shareable URL-based non-secret config for fresh Linux server setup.