import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useExpenses } from "../../hooks/useExpenses";
import { ExpenseCard } from "../../components/ExpenseCard";
import { getDateRange, formatCurrency } from "../../lib/utils";

type FilterType = "daily" | "monthly" | "yearly";
const filters: { value: FilterType; label: string; emoji: string }[] = [
  { value: "daily", label: "Daily", emoji: "📅" },
  { value: "monthly", label: "Monthly", emoji: "📆" },
  { value: "yearly", label: "Yearly", emoji: "🗓️" },
];

export default function ExpensesScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<FilterType>("monthly");
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const range = getDateRange(filter, offset);
  const { expenses, loading, totalSpent, deleteExpense, refresh } = useExpenses({ start: range.start, end: range.end });

  const onRefresh = async () => { setRefreshing(true); await refresh(); setRefreshing(false); };

  // Group by date
  const grouped: Record<string, typeof expenses> = {};
  for (const e of expenses) {
    if (!grouped[e.expense_date]) grouped[e.expense_date] = [];
    grouped[e.expense_date].push(e);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>Expenses 📝</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{formatCurrency(totalSpent)} spent</Text>

        {/* Filter tabs */}
        <View style={[styles.filterRow, { backgroundColor: colors.bgTertiary }]}>
          {filters.map(({ value, label, emoji }) => (
            <TouchableOpacity
              key={value}
              onPress={() => { setFilter(value); setOffset(0); }}
              style={[styles.filterTab, filter === value && { backgroundColor: colors.bgSecondary }]}
            >
              <Text style={styles.filterEmoji}>{emoji}</Text>
              <Text style={[styles.filterLabel, { color: filter === value ? colors.accent : colors.textSecondary }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date nav */}
        <View style={styles.dateNav}>
          <TouchableOpacity onPress={() => setOffset(o => o - 1)} style={[styles.navBtn, { backgroundColor: colors.bgTertiary }]}>
            <Text style={{ color: colors.textSecondary }}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.dateLabel, { color: colors.textPrimary }]} numberOfLines={1}>{range.label}</Text>
          <TouchableOpacity
            onPress={() => setOffset(o => o + 1)}
            disabled={offset >= 0}
            style={[styles.navBtn, { backgroundColor: colors.bgTertiary, opacity: offset >= 0 ? 0.3 : 1 }]}
          >
            <Text style={{ color: colors.textSecondary }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        {expenses.length > 0 && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{expenses.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>{formatCurrency(totalSpent)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
          </View>
        )}

        {/* List */}
        {expenses.length === 0 && !loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🐣</Text>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No expenses yet!</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Tap + to add one ~</Text>
          </View>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <View key={date} style={{ marginBottom: 12 }}>
              <Text style={[styles.dateGroup, { color: colors.textSecondary }]}>
                {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </Text>
              {items.map(e => <ExpenseCard key={e.id} expense={e} onDelete={deleteExpense} />)}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 2, marginBottom: 12 },
  filterRow: { flexDirection: "row", gap: 4, borderRadius: 16, padding: 4, marginBottom: 12 },
  filterTab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 8, borderRadius: 12 },
  filterEmoji: { fontSize: 12 },
  filterLabel: { fontSize: 12, fontWeight: "600" },
  dateNav: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dateLabel: { fontSize: 14, fontWeight: "700", flex: 1, textAlign: "center" },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 12, alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "800" },
  statLabel: { fontSize: 10, fontWeight: "600", marginTop: 2 },
  dateGroup: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  empty: { alignItems: "center", paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 14, fontWeight: "700" },
  emptySub: { fontSize: 12, marginTop: 4 },
});
