import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import type { ThemeMode } from "../lib/types";

const modes: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "📱" },
];

export function ThemeToggle() {
  const { mode, setMode, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgTertiary }]}>
      {modes.map(({ value, label, icon }) => (
        <TouchableOpacity
          key={value}
          onPress={() => setMode(value)}
          style={[styles.btn, mode === value && { backgroundColor: colors.bgSecondary, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }]}
        >
          <Text style={styles.icon}>{icon}</Text>
          <Text style={[styles.label, { color: mode === value ? colors.textPrimary : colors.textSecondary }]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 4, borderRadius: 14, padding: 4 },
  btn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 10, borderRadius: 10 },
  icon: { fontSize: 12 },
  label: { fontSize: 12, fontWeight: "600" },
});
