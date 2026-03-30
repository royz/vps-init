import type { VpsConfig } from "#/lib/vps-config";

export type ConfigUpdater = <K extends keyof VpsConfig>(
  key: K,
  value: VpsConfig[K],
) => void;