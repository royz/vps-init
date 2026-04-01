import {
  Alert,
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  Group,
  NumberInput,
  PasswordInput,
  rem,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  Globe,
  HardDrive,
  Info,
  KeyRound,
  Network,
  Package,
  Server,
  Shield,
  ShieldCheck,
  Terminal,
  ToggleRight,
  User,
} from "lucide-react";
import {
  NODE_VERSIONS,
  SHELL_THEMES,
  SWAP_SIZES,
  TIMEZONES,
  type VpsConfig,
} from "#/lib/vps-config";
import { useConfigStore } from "#/stores/home-store";
import { SecretBadge } from "./SecretBadge";
import { SectionCard } from "./SectionCard";

export function ConfigForm() {
  const config = useConfigStore((state) => state.config);
  const update = useConfigStore((state) => state.updateConfig);

  return (
    <Container>
      <Stack gap="sm">
        <Box mb={4}>
          <Title order={2} fz="xl" fw={700}>
            Configure your server
          </Title>
          <Text fz="sm" c="dimmed" mt={4}>
            Toggle the features you need. A ready-to-review Bash script updates
            live on the right.
          </Text>
        </Box>

        <SectionCard
          title="System"
          description="Initial package update, hostname, and timezone"
          icon={Server}
          color="indigo"
          alwaysEnabled
        >
          <Stack gap="md">
            <Switch
              label="Update & upgrade packages"
              description="Run apt-get update && apt-get upgrade on first boot"
              checked={config.updatePackages}
              onChange={(event) =>
                update("updatePackages", event.currentTarget.checked)
              }
            />
            <Divider />
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Hostname"
                  placeholder="e.g. my-vps"
                  value={config.hostname}
                  onChange={(event) =>
                    update("hostname", event.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  label="Timezone"
                  data={TIMEZONES}
                  value={config.timezone}
                  onChange={(value) => update("timezone", value ?? "UTC")}
                  searchable
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </SectionCard>

        <SectionCard
          title="Create Sudo User"
          description="A non-root user with sudo privileges - required"
          icon={User}
          color="blue"
          alwaysEnabled
        >
          <Stack gap="md">
            <Alert
              icon={<Info size={14} />}
              color="blue"
              variant="light"
              p="xs"
              fz="xs"
            >
              All tools (Node.js, Python, zsh) are installed under this user.
              The script will exit if left blank.
            </Alert>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Username"
                  placeholder="e.g. deploy"
                  value={config.username}
                  required
                  onChange={(event) =>
                    update("username", event.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <PasswordInput
                  label={
                    <Group gap={4} component="span">
                      Password
                      <SecretBadge />
                    </Group>
                  }
                  placeholder="Leave blank to skip"
                  value={config.userPassword}
                  onChange={(event) =>
                    update("userPassword", event.currentTarget.value)
                  }
                />
              </Grid.Col>
            </Grid>
            <Textarea
              label="SSH Authorized Public Keys"
              placeholder="ssh-ed25519 AAAA..."
              rows={3}
              value={config.sshAuthorizedKeys}
              onChange={(event) =>
                update("sshAuthorizedKeys", event.currentTarget.value)
              }
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="SSH Hardening"
          description="Restrict SSH access to reduce attack surface"
          icon={ShieldCheck}
          color="violet"
          enabled={config.sshHardening}
          onToggle={(value) => update("sshHardening", value)}
        >
          <Stack gap="md">
            <Alert
              icon={<Info size={14} />}
              color="orange"
              variant="light"
              p="xs"
              fz="xs"
            >
              Ensure you have a working SSH key installed before disabling
              password auth or root login.
            </Alert>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput
                  label="SSH Port"
                  description="Default is 22"
                  value={config.sshPort}
                  onChange={(value) =>
                    update("sshPort", typeof value === "number" ? value : 22)
                  }
                  min={1}
                  max={65535}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 8 }}>
                <Stack gap="sm" mt="lg">
                  <Switch
                    label="Disable root login"
                    checked={config.disableRootLogin}
                    onChange={(event) =>
                      update("disableRootLogin", event.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Disable password authentication"
                    description="SSH keys only - make sure keys are installed first"
                    checked={config.disablePasswordAuth}
                    onChange={(event) =>
                      update("disablePasswordAuth", event.currentTarget.checked)
                    }
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </SectionCard>

        <SectionCard
          title="Security"
          description="Firewall, intrusion prevention, and automatic updates"
          icon={Shield}
          color="red"
          alwaysEnabled
        >
          <Stack gap="lg">
            <Box>
              <Switch
                label="UFW Firewall"
                description="Block all inbound traffic except explicitly allowed ports"
                checked={config.firewallEnabled}
                onChange={(event) =>
                  update("firewallEnabled", event.currentTarget.checked)
                }
              />
              <Collapse in={config.firewallEnabled}>
                <Box mt="sm" ml={rem(46)}>
                  <TagsInput
                    label="Extra allowed ports"
                    description="Add ports to open (e.g. 8080/tcp, 5432/tcp)"
                    placeholder="8080/tcp"
                    value={config.firewallExtraPorts}
                    onChange={(value) => update("firewallExtraPorts", value)}
                  />
                </Box>
              </Collapse>
            </Box>

            <Divider />

            <Switch
              label="Fail2ban"
              description="Auto-ban IPs with repeated failed login attempts"
              checked={config.fail2banEnabled}
              onChange={(event) =>
                update("fail2banEnabled", event.currentTarget.checked)
              }
            />

            <Divider />

            <Switch
              label="Unattended security upgrades"
              description="Automatically apply OS security patches"
              checked={config.unattendedUpgradesEnabled}
              onChange={(event) =>
                update("unattendedUpgradesEnabled", event.currentTarget.checked)
              }
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="System Tuning"
          description="Swap memory and kernel tweaks"
          icon={HardDrive}
          color="yellow"
          alwaysEnabled
        >
          <Box>
            <Switch
              label="Configure swap"
              description="Create a swap file and tune vm.swappiness for server workloads"
              checked={config.swapEnabled}
              onChange={(event) =>
                update("swapEnabled", event.currentTarget.checked)
              }
            />
            <Collapse in={config.swapEnabled}>
              <Box mt="md" ml={rem(46)}>
                <Text fz="sm" fw={500} mb={6}>
                  Swap size
                </Text>
                <SegmentedControl
                  value={config.swapSize}
                  onChange={(value) => update("swapSize", value)}
                  data={SWAP_SIZES}
                  size="sm"
                />
              </Box>
            </Collapse>
          </Box>
        </SectionCard>

        <SectionCard
          title="Baseline Utilities"
          description="curl, git, htop, tmux, jq, ripgrep, and more"
          icon={Package}
          color="grape"
          enabled={config.baselineUtilities}
          onToggle={(value) => update("baselineUtilities", value)}
        >
          <Text fz="xs" c="dimmed">
            Installs:{" "}
            <Text span fz="xs" ff="monospace">
              curl wget git vim nano htop btop tmux screen build-essential jq
              ripgrep unzip zip net-tools dnsutils ncdu tree mtr
            </Text>
          </Text>
        </SectionCard>

        <SectionCard
          title="Node.js"
          description="Install via fnm (Fast Node Manager)"
          icon={ToggleRight}
          color="green"
          enabled={config.nodejsEnabled}
          onToggle={(value) => update("nodejsEnabled", value)}
        >
          <Stack gap="sm">
            <Text fz="sm" fw={500}>
              Version
            </Text>
            <SegmentedControl
              value={config.nodejsVersion}
              onChange={(value) => update("nodejsVersion", value)}
              data={NODE_VERSIONS}
              size="sm"
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="Python"
          description="Install uv - the fast Python package and project manager"
          icon={Terminal}
          color="cyan"
          enabled={config.uvEnabled}
          onToggle={(value) => update("uvEnabled", value)}
        >
          <Switch
            label="Install latest Python via uv"
            description="Runs uv python install after installing uv"
            checked={config.installLatestPython}
            onChange={(event) =>
              update("installLatestPython", event.currentTarget.checked)
            }
          />
        </SectionCard>

        <SectionCard
          title="Docker"
          description="Install Docker Engine from the official repository"
          icon={Server}
          color="blue"
          enabled={config.dockerEnabled}
          onToggle={(value) => update("dockerEnabled", value)}
        >
          <Stack gap="sm">
            <Switch
              label="Docker Compose plugin"
              description="Installs docker-compose-plugin (docker compose v2)"
              checked={config.dockerComposeEnabled}
              onChange={(event) =>
                update("dockerComposeEnabled", event.currentTarget.checked)
              }
            />
            <Switch
              label="Docker Buildx plugin"
              description="Multi-platform image builder"
              checked={config.dockerClientTools}
              onChange={(event) =>
                update("dockerClientTools", event.currentTarget.checked)
              }
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="Reverse Proxy"
          description="Caddy auto-manages TLS; Nginx gives manual control"
          icon={Globe}
          color="orange"
          alwaysEnabled
        >
          <Box>
            <Text fz="sm" fw={500} mb={8}>
              Choose reverse proxy
            </Text>
            <SegmentedControl
              value={config.reverseProxy}
              onChange={(value) =>
                update("reverseProxy", value as VpsConfig["reverseProxy"])
              }
              data={[
                { value: "none", label: "None" },
                { value: "caddy", label: "Caddy" },
                { value: "nginx", label: "Nginx" },
              ]}
            />
            {config.reverseProxy !== "none" && (
              <Alert
                icon={<Info size={14} />}
                color="orange"
                variant="light"
                p="xs"
                fz="xs"
                mt="sm"
              >
                Ports 80 and 443 will be opened in UFW automatically (if
                firewall is enabled).
              </Alert>
            )}
          </Box>
        </SectionCard>

        <SectionCard
          title="Tailscale"
          description="Zero-config VPN for secure private networking"
          icon={Network}
          color="indigo"
          enabled={config.tailscaleEnabled}
          onToggle={(value) => update("tailscaleEnabled", value)}
        >
          <Stack gap="md">
            <Textarea
              label={
                <Group gap={4} component="span">
                  Auth Key or Install Command
                  <SecretBadge />
                </Group>
              }
              description="Paste a bare auth key (tskey-auth-...) or the full install command copied from the Tailscale admin console. --advertise-exit-node will be detected automatically."
              placeholder={`tskey-auth-xxxxx\n\nor paste the full command:\ncurl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --auth-key=tskey-auth-xxxxx`}
              rows={3}
              value={config.tailscaleAuthKey}
              onChange={(event) => {
                const raw = event.currentTarget.value;
                update("tailscaleAuthKey", raw);
                if (raw.includes("--advertise-exit-node")) {
                  update("tailscaleAdvertiseExitNode", true);
                }
              }}
              styles={{
                input: {
                  fontFamily: "monospace",
                  fontSize: "var(--mantine-font-size-xs)",
                },
              }}
            />
            <Switch
              label="Advertise as exit node"
              description="Route all client internet traffic through this server. Requires approval in the Tailscale admin console."
              checked={config.tailscaleAdvertiseExitNode}
              onChange={(event) =>
                update(
                  "tailscaleAdvertiseExitNode",
                  event.currentTarget.checked,
                )
              }
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="Shell"
          description="Zsh, Oh My Zsh, autosuggestions, and zoxide"
          icon={Terminal}
          color="pink"
          enabled={config.zshEnabled}
          onToggle={(value) => update("zshEnabled", value)}
        >
          <Stack gap="md">
            <Switch
              label="Install Oh My Zsh"
              description="Popular Zsh framework with themes and plugins"
              checked={config.ohMyZshEnabled}
              onChange={(event) =>
                update("ohMyZshEnabled", event.currentTarget.checked)
              }
            />
            <Collapse in={config.ohMyZshEnabled}>
              <Stack gap="sm" mt="xs">
                <Select
                  label="Theme"
                  description="ZSH_THEME in .zshrc"
                  data={SHELL_THEMES}
                  value={config.shellTheme}
                  onChange={(value) => update("shellTheme", value ?? "avit")}
                  searchable
                />
                <Switch
                  label="Autosuggestions & completions"
                  description="Installs zsh-autosuggestions and zsh-completions as Oh My Zsh plugins"
                  checked={config.zshAutosuggestions}
                  onChange={(event) =>
                    update("zshAutosuggestions", event.currentTarget.checked)
                  }
                />
              </Stack>
            </Collapse>
            <Divider />
            <Switch
              label="Install zoxide"
              description="Smarter cd - use z <dir> to jump to frequently visited directories"
              checked={config.zoxideEnabled}
              onChange={(event) =>
                update("zoxideEnabled", event.currentTarget.checked)
              }
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="Doppler"
          description="Secrets manager CLI for environment variable management"
          icon={KeyRound}
          color="indigo"
          enabled={config.dopplerEnabled}
          onToggle={(value) => update("dopplerEnabled", value)}
        >
          <Alert
            icon={<Info size={14} />}
            color="indigo"
            variant="light"
            p="xs"
            fz="xs"
          >
            After install, run{" "}
            <Text span ff="monospace" fz="xs">
              doppler login
            </Text>{" "}
            and{" "}
            <Text span ff="monospace" fz="xs">
              doppler setup
            </Text>{" "}
            to configure a project.
          </Alert>
        </SectionCard>
      </Stack>
    </Container>
  );
}
