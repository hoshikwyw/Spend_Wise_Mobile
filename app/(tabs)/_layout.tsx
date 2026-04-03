import { Tabs } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";
import { AddExpenseSheet } from "../../components/AddExpenseSheet";

export default function TabsLayout() {
  const { colors } = useTheme();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.bgSecondary,
            borderTopColor: colors.border + "50",
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>🏠</Text>,
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>📝</Text>,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: " ",
            tabBarButton: (props) => (
              <View style={styles.fabWrapper}>
                <TouchableOpacity
                  onPress={() => setShowAdd(true)}
                  style={[styles.fab, { backgroundColor: colors.accent }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: "Budget",
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>🎯</Text>,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>⚙️</Text>,
          }}
        />
      </Tabs>

      <AddExpenseSheet visible={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  fabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: "#fff", fontSize: 30, fontWeight: "300", marginTop: -2 },
});
