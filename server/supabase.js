import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://zkwnoyjuzsogsrwarjpk.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_5MaUW2J_xLa-Mj6uqNuHNw_fttnHEva";

export const supabase = createClient(supabaseUrl, supabaseKey);
