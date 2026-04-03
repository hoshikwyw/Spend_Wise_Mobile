import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import type { Category } from "../lib/types";

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {categories.map((cat) => {
        const active = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[
              styles.pill,
              { borderColor: active ? colors.accent : colors.border, backgroundColor: active ? colors.accent + "15" : colors.bgTertiary },
            ]}
          >
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text style={[styles.label, { color: active ? colors.accent : colors.textSecondary }]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingHorizontal: 4, paddingVertical: 4 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 99, borderWidth: 1.5 },
  emoji: { fontSize: 16 },
  label: { fontSize: 13, fontWeight: "600" },
});
