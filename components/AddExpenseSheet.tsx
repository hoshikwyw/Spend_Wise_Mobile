import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useExpenses } from "../hooks/useExpenses";
import { CategoryPicker } from "./CategoryPicker";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AddExpenseSheet({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { categories, addExpense } = useExpenses();
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) { setAmount(""); setCategoryId(null); setNote(""); setDate(new Date().toISOString().split("T")[0]); }
  }, [visible]);

  const handleSubmit = async () => {
    if (!amount || !categoryId || parseFloat(amount) <= 0) return;
    setSaving(true);
    await addExpense({ amount: parseFloat(amount), category_id: categoryId, note: note || undefined, expense_date: date });
    setSaving(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { backgroundColor: colors.bgSecondary }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>Add Expense ✨</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Amount */}
            <View style={[styles.amountBox, { backgroundColor: colors.bgTertiary }]}>
              <Text style={[styles.currency, { color: colors.textSecondary }]}>MMK</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={colors.textSecondary + "40"}
                keyboardType="numeric"
                style={[styles.amountInput, { color: colors.textPrimary }]}
                autoFocus
              />
            </View>

            {/* Categories */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Pick a category ~</Text>
            <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />

            {/* Note */}
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a note (optional) 📝"
              placeholderTextColor={colors.textSecondary + "60"}
              style={[styles.noteInput, { backgroundColor: colors.bgTertiary, color: colors.textPrimary, borderColor: colors.border }]}
            />

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!amount || !categoryId || saving}
              style={[styles.submitBtn, { backgroundColor: colors.accent, opacity: (!amount || !categoryId) ? 0.5 : 1 }]}
            >
              <Text style={styles.submitText}>{saving ? "Adding..." : "Add Expense ✨"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, maxHeight: "80%" },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 16 },
  amountBox: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, padding: 16, marginBottom: 16 },
  currency: { fontSize: 16, fontWeight: "700" },
  amountInput: { fontSize: 36, fontWeight: "800", textAlign: "center", minWidth: 120 },
  label: { fontSize: 12, fontWeight: "600", marginBottom: 8 },
  noteInput: { borderWidth: 1, borderRadius: 14, padding: 14, fontSize: 14, marginTop: 12 },
  submitBtn: { borderRadius: 99, padding: 16, alignItems: "center", marginTop: 16, marginBottom: 8 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
