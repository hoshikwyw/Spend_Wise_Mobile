import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const redirectUrl = AuthSession.makeRedirectUri({ scheme: "spendwise" });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        // Handle fragment-based tokens
        const params = new URLSearchParams(url.hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          router.replace("/(tabs)");
        }
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={[styles.logoBox, { backgroundColor: colors.accentDark }]}>
          <Text style={styles.logoEmoji}>💰</Text>
        </View>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>SpendWise</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Track your spending, reach your goals ~{"\n"}Simple & cute expense tracking 💜
        </Text>

        {/* Mascot */}
        <Text style={styles.mascot}>🐷</Text>

        {/* Google Sign In */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          style={[styles.googleBtn, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={[styles.googleText, { color: colors.textPrimary }]}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={[styles.privacy, { color: colors.textSecondary + "80" }]}>
          Your data stays private and secure 🔒
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  content: { alignItems: "center", paddingHorizontal: 32 },
  logoBox: { width: 64, height: 64, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  logoEmoji: { fontSize: 30 },
  appName: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  tagline: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24 },
  mascot: { fontSize: 48, marginBottom: 32 },
  googleBtn: { flexDirection: "row", alignItems: "center", gap: 12, width: "100%", paddingVertical: 14, paddingHorizontal: 20, borderRadius: 99, borderWidth: 1.5 },
  googleIcon: { fontSize: 18, fontWeight: "700", color: "#4285F4" },
  googleText: { fontSize: 15, fontWeight: "600" },
  privacy: { fontSize: 11, marginTop: 16 },
});
