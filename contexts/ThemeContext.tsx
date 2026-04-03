import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { deriveAccentShades } from "../lib/utils";
import { DEFAULT_ACCENT } from "../lib/constants";
import type { ThemeMode } from "../lib/types";

interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  accentLight: string;
  accentDark: string;
}

const lightColors: Omit<ThemeColors, "accent" | "accentLight" | "accentDark"> = {
  bgPrimary: "#FBF8FF",
  bgSecondary: "#FFFFFF",
  bgTertiary: "#F3EEFF",
  textPrimary: "#1E1B2E",
  textSecondary: "#8C82A6",
  border: "#E8DFF5",
};

const darkColors: Omit<ThemeColors, "accent" | "accentLight" | "accentDark"> = {
  bgPrimary: "#0C0A14",
  bgSecondary: "#16132A",
  bgTertiary: "#211D3A",
  textPrimary: "#F0ECFF",
  textSecondary: "#9B93B8",
  border: "#2D2750",
};

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  colors: ThemeColors;
  accentColor: string;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [accentColor, setAccentState] = useState(DEFAULT_ACCENT);

  // Load from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem("theme_mode").then((v) => v && setModeState(v as ThemeMode));
    AsyncStorage.getItem("accent_color").then((v) => v && setAccentState(v));
  }, []);

  const resolvedMode = mode === "system" ? (systemScheme || "light") : mode;
  const shades = deriveAccentShades(accentColor);
  const base = resolvedMode === "dark" ? darkColors : lightColors;
  const colors: ThemeColors = {
    ...base,
    accent: shades.base,
    accentLight: shades.light,
    accentDark: shades.dark,
  };

  const persistToSupabase = useCallback(async (theme: ThemeMode, accent: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("user_preferences").update({
      theme, accent_color: accent, updated_at: new Date().toISOString(),
    }).eq("user_id", user.id);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem("theme_mode", m);
    persistToSupabase(m, accentColor);
  }, [accentColor, persistToSupabase]);

  const setAccentColor = useCallback((c: string) => {
    setAccentState(c);
    AsyncStorage.setItem("accent_color", c);
    persistToSupabase(mode, c);
  }, [mode, persistToSupabase]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, colors, accentColor, setMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
