export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  emoji: string;
  color: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  note: string | null;
  expense_date: string;
  created_at: string;
  category?: Category;
}

export interface Budget {
  id: string;
  user_id: string;
  month: string;
  amount: number;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: "light" | "dark" | "system";
  accent_color: string;
  currency: string;
  updated_at: string;
}

export type ThemeMode = "light" | "dark" | "system";
