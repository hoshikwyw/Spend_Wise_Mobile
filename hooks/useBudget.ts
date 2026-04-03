import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Budget } from "../lib/types";
import { getMonthStart } from "../lib/utils";

export function useBudget(month?: string) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const targetMonth = month || getMonthStart();

  const fetchBudget = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("budgets").select("*").eq("month", targetMonth).single();
    setBudget(data);
    setLoading(false);
  }, [targetMonth]);

  useEffect(() => { fetchBudget(); }, [fetchBudget]);

  const setBudgetAmount = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("budgets").upsert({ user_id: user.id, month: targetMonth, amount }, { onConflict: "user_id,month" });
    if (!error) await fetchBudget();
    return { error };
  };

  return { budget, loading, setBudgetAmount, refresh: fetchBudget };
}
