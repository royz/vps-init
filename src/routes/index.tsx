import { CodeHighlight } from "@mantine/code-highlight";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Group,
  NumberInput,
  Paper,
  PasswordInput,
  Modal,
  rem,
  ScrollArea,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import {
  Cloud,
  Copy,
  Download,
  FlameKindling,
  Globe,
  HardDrive,
  Info,
  KeyRound,
  Moon,
  Network,
  Package,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Sun,
  Terminal,
  ToggleRight,
  User,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { buildScript } from "#/lib/script-builder";
import {
  DEFAULT_CONFIG,
  NODE_VERSIONS,
  SHELL_THEMES,
  SWAP_SIZES,
  TIMEZONES,
  type VpsConfig,
} from "#/lib/vps-config";

export const Route = createFileRoute("/")({ component: HomePage });

// ── Helpers ───────────────────────────────────────────────────────────────────

function SecretBadge() {
  return (
    <Badge size="xs" color="orange" variant="light" ml={6}>
      sensitive
    </Badge>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  color = "teal",
  enabled,
  onToggle,
  children,
  alwaysEnabled = false,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  color?: string;
  enabled?: boolean;
  onToggle?: (v: boolean) => void;
  children?: React.ReactNode;
  alwaysEnabled?: boolean;
}) {
  const isOpen = alwaysEnabled || !!enabled;

  return (
    <Paper withBorder radius="md" p="lg">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <ThemeIcon
            variant="light"
            color={color}
            size={40}
            radius="md"
            mt={2}
            style={{ flexShrink: 0 }}
          >
            <Icon size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={700} fz="sm" lh={1.3}>
              {title}
            </Text>
            <Text fz="xs" c="dimmed" lh={1.4} mt={2}>
              {description}
            </Text>
          </Box>
        </Group>
        {!alwaysEnabled && onToggle && (
          <Switch
            checked={!!enabled}
            onChange={(e) => onToggle(e.currentTarget.checked)}
            mt={4}
            style={{ flexShrink: 0 }}
          />
        )}
      </Group>

      {isOpen && children && (
        <Collapse in={isOpen}>
          <Divider my="md" />
          {children}
        </Collapse>
      )}
    </Paper>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

function HomePage() {
  const [config, setConfig] = useState<VpsConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light");

  const update = useCallback(
    <K extends keyof VpsConfig>(key: K, value: VpsConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const script = useMemo(() => buildScript(config), [config]);

  function handleCopy() {
    navigator.clipboard.writeText(script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vps-init.sh";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleResetConfirm() {
    setConfig(DEFAULT_CONFIG);
    setCopied(false);
    setResetModalOpen(false);
  }

  const isDark = computedScheme === "dark";

  return (
    <Box mih="100dvh">
      <Modal
        opened={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset all options?"
        centered
      >
        <Text fz="sm" c="dimmed" mb="md">
          This will restore all configuration fields to their default values.
        </Text>
        <Group justify="flex-end">
          <Button
            variant="default"
            size="xs"
            onClick={() => setResetModalOpen(false)}
          >
            Cancel
          </Button>
          <Button color="red" size="xs" onClick={handleResetConfirm}>
            Yes, reset
          </Button>
        </Group>
      </Modal>

      {/* ── Header ── */}
      <Box
        component="header"
        px={{ base: "md", sm: "xl" }}
        py="md"
        style={(theme) => ({
          borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: isDark ? theme.colors.dark[7] : "#fff",
        })}
      >
        <Group justify="space-between" maw={1400} mx="auto">
          <Group gap="sm">
            <ThemeIcon variant="filled" color="teal" size={38} radius="md">
              <Server size={20} />
            </ThemeIcon>
            <Box>
              <Title order={4} lh={1.2} c="teal">
                VPS Init
              </Title>
              <Text fz="xs" c="dimmed" lh={1}>
                Bootstrap script generator
              </Text>
            </Box>
          </Group>
          <Group gap="xs">
            <Tooltip label="Reset all options to defaults" withArrow>
              <ActionIcon
                variant="default"
                color="gray"
                size="lg"
                radius="md"
                onClick={() => setResetModalOpen(true)}
              >
                <RefreshCw size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={copied ? "Copied!" : "Copy script"} withArrow>
              <ActionIcon
                variant={copied ? "filled" : "default"}
                color={copied ? "teal" : undefined}
                size="lg"
                radius="md"
                onClick={handleCopy}
              >
                <Copy size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Download as .sh file" withArrow>
              <ActionIcon
                variant="default"
                size="lg"
                radius="md"
                onClick={handleDownload}
              >
                <Download size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={isDark ? "Light mode" : "Dark mode"} withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                radius="md"
                onClick={() => setColorScheme(isDark ? "light" : "dark")}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Box>

      {/* ── Main content ── */}
      <Box px={{ base: "md", sm: "xl" }} py="lg" maw={1400} mx="auto">
        <Grid gutter="lg">
          {/* ── Left column: config form ── */}
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Stack gap="sm">
              {/* Intro */}
              <Box mb={4}>
                <Title order={2} fz="xl" fw={700}>
                  Configure your server
                </Title>
                <Text fz="sm" c="dimmed" mt={4}>
                  Toggle the features you need. A ready-to-review Bash script
                  updates live on the right.
                </Text>
              </Box>

              {/* ── System Basics ── */}
              <SectionCard
                title="System"
                description="Initial package update, hostname, and timezone"
                icon={Server}
                color="teal"
                alwaysEnabled
              >
                <Stack gap="md">
                  <Switch
                    label="Update & upgrade packages"
                    description="Run apt-get update && apt-get upgrade on first boot"
                    checked={config.updatePackages}
                    onChange={(e) =>
                      update("updatePackages", e.currentTarget.checked)
                    }
                  />
                  <Divider />
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Hostname"
                        placeholder="e.g. my-vps"
                        value={config.hostname}
                        onChange={(e) =>
                          update("hostname", e.currentTarget.value)
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Select
                        label="Timezone"
                        data={TIMEZONES}
                        value={config.timezone}
                        onChange={(v) => update("timezone", v ?? "UTC")}
                        searchable
                      />
                    </Grid.Col>
                  </Grid>
                </Stack>
              </SectionCard>

              {/* ── User Setup ── */}
              <SectionCard
                title="Create Sudo User"
                description="A non-root user with sudo privileges — required"
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
                    All tools (Node.js, Python, zsh) are installed under this
                    user. The script will exit if left blank.
                  </Alert>
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Username"
                        placeholder="e.g. deploy"
                        value={config.username}
                        required
                        onChange={(e) =>
                          update("username", e.currentTarget.value)
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
                        onChange={(e) =>
                          update("userPassword", e.currentTarget.value)
                        }
                      />
                    </Grid.Col>
                  </Grid>
                  <Textarea
                    label="SSH Authorized Public Keys"
                    placeholder="ssh-ed25519 AAAA..."
                    rows={3}
                    value={config.sshAuthorizedKeys}
                    onChange={(e) =>
                      update("sshAuthorizedKeys", e.currentTarget.value)
                    }
                  />
                </Stack>
              </SectionCard>

              {/* ── SSH Hardening ── */}
              <SectionCard
                title="SSH Hardening"
                description="Restrict SSH access to reduce attack surface"
                icon={ShieldCheck}
                color="violet"
                enabled={config.sshHardening}
                onToggle={(v) => update("sshHardening", v)}
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
                        onChange={(v) =>
                          update("sshPort", typeof v === "number" ? v : 22)
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
                          onChange={(e) =>
                            update("disableRootLogin", e.currentTarget.checked)
                          }
                        />
                        <Switch
                          label="Disable password authentication"
                          description="SSH keys only — make sure keys are installed first"
                          checked={config.disablePasswordAuth}
                          onChange={(e) =>
                            update(
                              "disablePasswordAuth",
                              e.currentTarget.checked,
                            )
                          }
                        />
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Stack>
              </SectionCard>

              {/* ── Security ── */}
              <SectionCard
                title="Security"
                description="Firewall, intrusion prevention, and automatic updates"
                icon={Shield}
                color="red"
                alwaysEnabled
              >
                <Stack gap="lg">
                  {/* UFW */}
                  <Box>
                    <Switch
                      label="UFW Firewall"
                      description="Block all inbound traffic except explicitly allowed ports"
                      checked={config.firewallEnabled}
                      onChange={(e) =>
                        update("firewallEnabled", e.currentTarget.checked)
                      }
                    />
                    <Collapse in={config.firewallEnabled}>
                      <Box mt="sm" ml={rem(46)}>
                        <TagsInput
                          label="Extra allowed ports"
                          description="Add ports to open (e.g. 8080/tcp, 5432/tcp)"
                          placeholder="8080/tcp"
                          value={config.firewallExtraPorts}
                          onChange={(v) => update("firewallExtraPorts", v)}
                        />
                      </Box>
                    </Collapse>
                  </Box>

                  <Divider />

                  <Switch
                    label="Fail2ban"
                    description="Auto-ban IPs with repeated failed login attempts"
                    checked={config.fail2banEnabled}
                    onChange={(e) =>
                      update("fail2banEnabled", e.currentTarget.checked)
                    }
                  />

                  <Divider />

                  <Switch
                    label="Unattended security upgrades"
                    description="Automatically apply OS security patches"
                    checked={config.unattendedUpgradesEnabled}
                    onChange={(e) =>
                      update(
                        "unattendedUpgradesEnabled",
                        e.currentTarget.checked,
                      )
                    }
                  />
                </Stack>
              </SectionCard>

              {/* ── System Tuning ── */}
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
                    onChange={(e) =>
                      update("swapEnabled", e.currentTarget.checked)
                    }
                  />
                  <Collapse in={config.swapEnabled}>
                    <Box mt="md" ml={rem(46)}>
                      <Text fz="sm" fw={500} mb={6}>
                        Swap size
                      </Text>
                      <SegmentedControl
                        value={config.swapSize}
                        onChange={(v) => update("swapSize", v)}
                        data={SWAP_SIZES}
                        size="sm"
                      />
                    </Box>
                  </Collapse>
                </Box>
              </SectionCard>

              {/* ── Baseline Utilities ── */}
              <SectionCard
                title="Baseline Utilities"
                description="curl, git, htop, tmux, jq, ripgrep, and more"
                icon={Package}
                color="grape"
                enabled={config.baselineUtilities}
                onToggle={(v) => update("baselineUtilities", v)}
              >
                <Text fz="xs" c="dimmed">
                  Installs:{" "}
                  <Text span fz="xs" ff="monospace">
                    curl wget git vim nano htop btop tmux screen build-essential
                    jq ripgrep unzip zip net-tools dnsutils ncdu tree mtr
                  </Text>
                </Text>
              </SectionCard>

              {/* ── Node.js ── */}
              <SectionCard
                title="Node.js"
                description="Install via fnm (Fast Node Manager)"
                icon={ToggleRight}
                color="green"
                enabled={config.nodejsEnabled}
                onToggle={(v) => update("nodejsEnabled", v)}
              >
                <Stack gap="sm">
                  <Text fz="sm" fw={500}>
                    Version
                  </Text>
                  <SegmentedControl
                    value={config.nodejsVersion}
                    onChange={(v) => update("nodejsVersion", v)}
                    data={NODE_VERSIONS}
                    size="sm"
                  />
                </Stack>
              </SectionCard>

              {/* ── Python ── */}
              <SectionCard
                title="Python"
                description="Install uv — the fast Python package and project manager"
                icon={Terminal}
                color="cyan"
                enabled={config.uvEnabled}
                onToggle={(v) => update("uvEnabled", v)}
              >
                <Switch
                  label="Install latest Python via uv"
                  description="Runs uv python install after installing uv"
                  checked={config.installLatestPython}
                  onChange={(e) =>
                    update("installLatestPython", e.currentTarget.checked)
                  }
                />
              </SectionCard>

              {/* ── Docker ── */}
              <SectionCard
                title="Docker"
                description="Install Docker Engine from the official repository"
                icon={Server}
                color="blue"
                enabled={config.dockerEnabled}
                onToggle={(v) => update("dockerEnabled", v)}
              >
                <Stack gap="sm">
                  <Switch
                    label="Docker Compose plugin"
                    description="Installs docker-compose-plugin (docker compose v2)"
                    checked={config.dockerComposeEnabled}
                    onChange={(e) =>
                      update("dockerComposeEnabled", e.currentTarget.checked)
                    }
                  />
                  <Switch
                    label="Docker Buildx plugin"
                    description="Multi-platform image builder"
                    checked={config.dockerClientTools}
                    onChange={(e) =>
                      update("dockerClientTools", e.currentTarget.checked)
                    }
                  />
                </Stack>
              </SectionCard>

              {/* ── Reverse Proxy ── */}
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
                    onChange={(v) =>
                      update("reverseProxy", v as VpsConfig["reverseProxy"])
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

              {/* ── Tailscale ── */}
              <SectionCard
                title="Tailscale"
                description="Zero-config VPN for secure private networking"
                icon={Network}
                color="indigo"
                enabled={config.tailscaleEnabled}
                onToggle={(v) => update("tailscaleEnabled", v)}
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
                    onChange={(e) => {
                      const raw = e.currentTarget.value;
                      update("tailscaleAuthKey", raw);
                      // Auto-detect --advertise-exit-node in pasted command
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
                    onChange={(e) =>
                      update(
                        "tailscaleAdvertiseExitNode",
                        e.currentTarget.checked,
                      )
                    }
                  />
                </Stack>
              </SectionCard>

              {/* ── Shell ── */}
              <SectionCard
                title="Shell"
                description="Zsh, Oh My Zsh, autosuggestions, and zoxide"
                icon={Terminal}
                color="pink"
                enabled={config.zshEnabled}
                onToggle={(v) => update("zshEnabled", v)}
              >
                <Stack gap="md">
                  <Switch
                    label="Install Oh My Zsh"
                    description="Popular Zsh framework with themes and plugins"
                    checked={config.ohMyZshEnabled}
                    onChange={(e) =>
                      update("ohMyZshEnabled", e.currentTarget.checked)
                    }
                  />
                  <Collapse in={config.ohMyZshEnabled}>
                    <Stack gap="sm" mt="xs">
                      <Select
                        label="Theme"
                        description="ZSH_THEME in .zshrc"
                        data={SHELL_THEMES}
                        value={config.shellTheme}
                        onChange={(v) => update("shellTheme", v ?? "avit")}
                        searchable
                      />
                      <Switch
                        label="Autosuggestions & completions"
                        description="Installs zsh-autosuggestions and zsh-completions as Oh My Zsh plugins"
                        checked={config.zshAutosuggestions}
                        onChange={(e) =>
                          update("zshAutosuggestions", e.currentTarget.checked)
                        }
                      />
                    </Stack>
                  </Collapse>
                  <Divider />
                  <Switch
                    label="Install zoxide"
                    description="Smarter cd — use z <dir> to jump to frequently visited directories"
                    checked={config.zoxideEnabled}
                    onChange={(e) =>
                      update("zoxideEnabled", e.currentTarget.checked)
                    }
                  />
                </Stack>
              </SectionCard>

              {/* ── Doppler ── */}
              <SectionCard
                title="Doppler"
                description="Secrets manager CLI for environment variable management"
                icon={KeyRound}
                color="teal"
                enabled={config.dopplerEnabled}
                onToggle={(v) => update("dopplerEnabled", v)}
              >
                <Alert
                  icon={<Info size={14} />}
                  color="teal"
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
          </Grid.Col>

          {/* ── Right column: script preview ── */}
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Box
              style={{
                position: "sticky",
                top: rem(95),
                maxHeight: "calc(100dvh - 115px)",
                display: "flex",
                flexDirection: "column",
                gap: rem(12),
              }}
            >
              <Group justify="space-between" align="center">
                <Box>
                  <Title order={5} fw={700}>
                    Generated script
                  </Title>
                  <Text fz="xs" c="dimmed">
                    vps-init.sh — review before running
                  </Text>
                </Box>
              </Group>

              <Paper
                withBorder
                radius="md"
                style={{
                  overflow: "hidden",
                  // flex: 1,
                  // minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ScrollArea style={{ flex: 1 }} scrollbarSize={6}>
                  <CodeHighlight
                    code={script}
                    language="bash"
                    withCopyButton={false}
                    styles={{
                      pre: {
                        borderRadius: 0,
                        margin: 0,
                        fontSize: rem(11.5),
                      },
                    }}
                  />
                </ScrollArea>
              </Paper>

              {/* Usage hint */}
              <Paper withBorder radius="md" p="sm">
                <Group gap="xs" align="flex-start">
                  <FlameKindling
                    size={15}
                    color="var(--mantine-color-teal-6)"
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <Box>
                    <Text fz="xs" fw={600} mb={4}>
                      How to run
                    </Text>
                    <Text fz="xs" c="dimmed">
                      Download, review, upload to your server, then:
                    </Text>
                    <Text fz="xs" ff="monospace" mt={4}>
                      sudo bash vps-init.sh
                    </Text>
                  </Box>
                </Group>
              </Paper>

              {/* Secrets notice */}
              {(config.userPassword || config.tailscaleAuthKey) && (
                <Alert
                  icon={<Cloud size={14} />}
                  color="orange"
                  variant="light"
                  p="sm"
                  fz="xs"
                >
                  <Text fz="xs" fw={600} mb={2}>
                    Sensitive values in your script
                  </Text>
                  <Text fz="xs">
                    The downloaded file will contain your sensitive inputs.
                    Store it securely and delete it after use.
                  </Text>
                </Alert>
              )}
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}
