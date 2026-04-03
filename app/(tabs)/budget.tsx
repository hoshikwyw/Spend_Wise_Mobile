import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useBudget } from "../../hooks/useBudget";
import { useExpenses } from "../../hooks/useExpenses";
import { BudgetProgress } from "../../components/BudgetProgress";
import { formatCurrency, getMonthStart, getMonthName } from "../../lib/utils";

export default function BudgetScreen() {
  const { colors } = useTheme();
  const [monthOffset, setMonthOffset] = useState(0);
  const [editAmount, setEditAmount] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const month = getMonthStart(target);

  const { budget, setBudgetAmount } = useBudget(month);
  const { totalSpent, spendingByCategory } = useExpenses(month);
  const budgetAmount = budget?.amount ? Number(budget.amount) : 0;

  const handleSave = async () => {
    const amount = parseFloat(editAmount);
    if (!amount || amount <= 0) return;
    setSaving(true);
    await setBudgetAmount(amount);
    setSaving(false);
    setEditing(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgPrimary }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Budget 🎯</Text>
          <View style={styles.dateNav}>
            <TouchableOpacity onPress={() => setMonthOffset(o => o - 1)} style={[styles.navBtn, { backgroundColor: colors.bgTertiary }]}>
              <Text style={{ color: colors.textSecondary }}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.dateLabel, { color: colors.textPrimary }]}>{getMonthName(month)}</Text>
            <TouchableOpacity onPress={() => setMonthOffset(o => o + 1)} disabled={monthOffset >= 0} style={[styles.navBtn, { backgroundColor: colors.bgTertiary, opacity: monthOffset >= 0 ? 0.3 : 1 }]}>
              <Text style={{ color: colors.textSecondary }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Budget card */}
        {budgetAmount > 0 && !editing ? (
          <>
            <BudgetProgress budget={budgetAmount} spent={totalSpent} />
            <TouchableOpacity onPress={() => { setEditAmount(String(budgetAmount)); setEditing(true); }}>
              <Text style={[styles.editLink, { color: colors.accent }]}>Edit budget</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80" }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              {editing ? "Edit Budget" : "Set Monthly Budget"}
            </Text>
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              placeholder="e.g. 500000"
              placeholderTextColor={colors.textSecondary + "60"}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: colors.bgTertiary, color: colors.textPrimary, borderColor: colors.border }]}
            />
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: colors.accent }]}>
                <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
              {editing && (
                <TouchableOpacity onPress={() => setEditing(false)} style={[styles.cancelBtn, { backgroundColor: colors.bgTertiary }]}>
                  <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Category breakdown */}
        {spendingByCategory.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.bgSecondary, borderColor: colors.border + "80", marginTop: 12 }]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Category Breakdown</Text>
            {spendingByCategory.map((cat) => {
              const pct = budgetAmount > 0 ? (cat.total / budgetAmount) * 100 : 0;
              return (
                <View key={cat.id} style={{ marginBottom: 10 }}>
                  <View style={styles.catRow}>
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    <Text style={[styles.catName, { color: colors.textPrimary }]}>{cat.name}</Text>
                    <Text style={[styles.catAmount, { color: colors.textSecondary }]}>{formatCurrency(cat.total)}</Text>
                  </View>
                  <View style={[styles.barBg, { backgroundColor: colors.bgTertiary }]}>
                    <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: cat.color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  dateNav: { flexDirection: "row", alignItems: "center", gap: 8 },
  navBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  dateLabel: { fontSize: 13, fontWeight: "600", minWidth: 100, textAlign: "center" },
  editLink: { fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 4, marginBottom: 8 },
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 12 },
  btnRow: { flexDirection: "row", gap: 8 },
  saveBtn: { flex: 1, borderRadius: 99, padding: 14, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  cancelBtn: { flex: 1, borderRadius: 99, padding: 14, alignItems: "center" },
  cancelBtnText: { fontWeight: "600", fontSize: 14 },
  catRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  catEmoji: { fontSize: 14 },
  catName: { flex: 1, fontSize: 12, fontWeight: "600" },
  catAmount: { fontSize: 12, fontWeight: "600" },
  barBg: { height: 5, borderRadius: 99, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99 },
});
