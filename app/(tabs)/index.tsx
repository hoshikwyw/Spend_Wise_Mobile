import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useExpenses } from "../../hooks/useExpenses";
import { useBudget } from "../../hooks/useBudget";
import { formatCurrency, getMonthStart } from "../../lib/utils";
import { ExpenseCard } from "../../components/ExpenseCard";
import { BudgetProgress } from "../../components/BudgetProgress";
import { useState } from "react";

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "🌸" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
}

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const month = getMonthStart();
  const { expenses, totalSpent, spendingByCategory, loading, deleteExpense, refresh } = useExpenses(month);
  const { budget } = useBudget(month);
  const greeting = getGreeting();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={[styles.greetText, { color: colors.textPrimary }]}>
            {greeting.text}, {firstName}! {greeting.emoji}
          </Text>
          <Text style={[styles.greetSub, { color: colors.textSecondary }]}>
            ✨ Here's your spending overview ~
          </Text>
        </View>

        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.accentDark }]}>
          <View style={styles.summaryDecor} />
          <Text style={styles.summaryLabel}>This Month</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalSpent)}</Text>
          <Text style={styles.summaryCount}>
            {expenses.length} expense{expenses.length !== 1 ? "s" : ""} {expenses.length === 0 && "~ stay strong!"}
          </Text>
          <Text style={styles.summaryEmoji}>
            {totalSpent === 0 ? "🎉" : totalSpent > 500000 ? "😅" : "💰"}
          </Text>
        </View>

        {/* Budget */}
        <BudgetProgress budget={budget?.amount ? Number(budget.amount) : null} spent={totalSpent} />

        {/* Category Breakdown */}
        {spendingByCategory.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Spending by Category</Text>
            {spendingByCategory.slice(0, 5).map((cat) => (
              <View key={cat.id} style={styles.catRow}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catName, { color: colors.textSecondary }]} numberOfLines={1}>{cat.name}</Text>
                <Text style={[styles.catAmount, { color: colors.textPrimary }]}>{formatCurrency(cat.total)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Expenses */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 8 }]}>Recent Expenses 📝</Text>
        {expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🐷</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No expenses yet!</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Tap + to add your first expense ~</Text>
          </View>
        ) : (
          expenses.slice(0, 5).map((e) => <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  greeting: { marginBottom: 16 },
  greetText: { fontSize: 22, fontWeight: "800" },
  greetSub: { fontSize: 13, marginTop: 4 },
  summaryCard: { borderRadius: 22, padding: 20, marginBottom: 12, overflow: "hidden", position: "relative" },
  summaryDecor: { position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" },
  summaryAmount: { color: "#fff", fontSize: 30, fontWeight: "800", marginTop: 4 },
  summaryCount: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 },
  summaryEmoji: { position: "absolute", top: 16, right: 16, fontSize: 28 },
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
  catRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  catEmoji: { fontSize: 16 },
  catName: { flex: 1, fontSize: 12 },
  catAmount: { fontSize: 12, fontWeight: "700" },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 14, fontWeight: "700" },
  emptySub: { fontSize: 12, marginTop: 4 },
});
