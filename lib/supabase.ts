import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fcqovnyfictyxbtmlmej.supabase.co";  // your API URL
const supabaseAnonKey = "sb_publishable_cpnZw-SKxSmve_0b3mRUKQ_BNBJXbIH";      // your publishable key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
