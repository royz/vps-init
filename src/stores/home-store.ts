import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_CONFIG, type VpsConfig } from "#/lib/vps-config";

type ConfigStore = {
  config: VpsConfig;
  updateConfig: <K extends keyof VpsConfig>(key: K, value: VpsConfig[K]) => void;
  resetConfig: () => void;
};

type HomeUiStore = {
  copied: boolean;
  resetModalOpen: boolean;
  setCopied: (value: boolean) => void;
  setResetModalOpen: (value: boolean) => void;
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      updateConfig: (key, value) =>
        set((state) => ({
          config: {
            ...state.config,
            [key]: value,
          },
        })),
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    {
      name: "vps-init-config",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ config: state.config }),
    },
  ),
);

export const useHomeUiStore = create<HomeUiStore>((set) => ({
  copied: false,
  resetModalOpen: false,
  setCopied: (value) => set({ copied: value }),
  setResetModalOpen: (value) => set({ resetModalOpen: value }),
}));
