import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qcwoxujecaghlsigiijl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjd294dWplY2FnaGxzaWdpaWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzY2MjEsImV4cCI6MjA5MDc1MjYyMX0._-fMulZn-UN1LWIM3_pMzstgj8HpWJFlmn7vK6TE_qs";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
