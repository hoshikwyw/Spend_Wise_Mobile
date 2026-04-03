import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggle } from "../../components/ThemeToggle";
import { ACCENT_PRESETS } from "../../lib/constants";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { colors, accentColor, setAccentColor } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => { await signOut(); router.replace("/login"); },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings ⚙️</Text>

        {/* Profile */}
        <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
          <View style={styles.profile}>
            <View style={[styles.avatar, { backgroundColor: colors.accent + "20" }]}>
              {user?.user_metadata?.avatar_url ? (
                <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.avatarImg} />
              ) : (
                <Text style={{ fontSize: 20 }}>👤</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                {user?.user_metadata?.full_name || "User"}
              </Text>
              <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🎨 Appearance</Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Theme</Text>
          <ThemeToggle />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>Accent Color</Text>
          <View style={styles.colorGrid}>
            {ACCENT_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.color}
                onPress={() => setAccentColor(preset.color)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: preset.color },
                  accentColor === preset.color && styles.colorSwatchActive,
                ]}
              >
                {accentColor === preset.color && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity onPress={handleSignOut} style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
          <Text style={styles.signOut}>🚪 Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16 },
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12 },
  profile: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImg: { width: 48, height: 48, borderRadius: 16 },
  name: { fontSize: 14, fontWeight: "600" },
  email: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "600", marginBottom: 8 },
  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorSwatch: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  colorSwatchActive: { borderWidth: 3, borderColor: "#fff" },
  checkmark: { color: "#fff", fontSize: 16, fontWeight: "700" },
  signOut: { fontSize: 14, fontWeight: "600", color: "#EF4444" },
});
