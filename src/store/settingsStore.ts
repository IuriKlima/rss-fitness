import { create } from 'zustand';
import type { SiteSettings } from '../services/settings';
import { getSettings, DEFAULT_SETTINGS } from '../services/settings';

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettingsLocally: (settings: SiteSettings) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  loading: true,
  fetchSettings: async () => {
    set({ loading: true });
    const data = await getSettings();
    set({ settings: data, loading: false });
  },
  updateSettingsLocally: (settings) => set({ settings }),
}));
