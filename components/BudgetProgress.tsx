import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { formatCurrency } from "../lib/utils";

interface Props {
  budget: number | null;
  spent: number;
}

export function BudgetProgress({ budget, spent }: Props) {
  const { colors } = useTheme();
  if (!budget) return null;

  const pct = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const barColor = pct < 60 ? "#10B981" : pct < 85 ? "#F59E0B" : "#EF4444";

  return (
    <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>🎯 Budget</Text>
        <Text style={[styles.amount, { color: colors.textSecondary }]}>{formatCurrency(budget)}</Text>
      </View>
      <View style={[styles.barBg, { backgroundColor: colors.bgTertiary }]}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.footer}>
        <View>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Spent</Text>
          <Text style={[styles.footerValue, { color: colors.textPrimary }]}>{formatCurrency(spent)}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Remaining</Text>
          <Text style={[styles.footerValue, { color: remaining >= 0 ? "#10B981" : "#EF4444" }]}>
            {remaining >= 0 ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 14, fontWeight: "700" },
  amount: { fontSize: 12 },
  barBg: { height: 8, borderRadius: 99, overflow: "hidden", marginBottom: 12 },
  barFill: { height: "100%", borderRadius: 99 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  footerLabel: { fontSize: 11 },
  footerValue: { fontSize: 15, fontWeight: "700", marginTop: 2 },
});
