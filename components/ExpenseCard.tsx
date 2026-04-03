import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { formatCurrency } from "../lib/utils";
import type { Expense } from "../lib/types";

interface Props {
  expense: Expense;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, onDelete }: Props) {
  const { colors } = useTheme();
  const cat = expense.category;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
      <View style={[styles.emojiBox, { backgroundColor: (cat?.color || "#8B5CF6") + "15" }]}>
        <Text style={styles.emoji}>{cat?.emoji || "📦"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>{cat?.name || "Uncategorized"}</Text>
        {expense.note ? <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>{expense.note}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: colors.textPrimary }]}>-{formatCurrency(Number(expense.amount))}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(expense.expense_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(expense.id)} style={styles.deleteBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 6 },
  emojiBox: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 18 },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: "600" },
  note: { fontSize: 11, marginTop: 2 },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 13, fontWeight: "700" },
  date: { fontSize: 10, marginTop: 2 },
  deleteBtn: { padding: 4 },
});
