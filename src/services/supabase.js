import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zkwnoyjuzsogsrwarjpk.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_5MaUW2J_xLa-Mj6uqNuHNw_fttnHEva";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function supabaseSyncProfile(user) {
  if (!user) return null;
  try {
    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email.toLowerCase().trim(),
      phone: user.phone || "",
      pass: user.pass || "demo123",
      org: user.org || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
      created_at: user.created || new Date().toISOString()
    };
    const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select();
    if (error) {
      console.warn("Supabase client profile notice:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Supabase client profile error:", err);
    return null;
  }
}

export async function supabaseSyncScheme(scheme) {
  if (!scheme) return null;
  try {
    const payload = {
      id: scheme.id,
      type: scheme.type,
      owner_id: scheme.ownerId,
      company: scheme.company,
      name: scheme.name,
      amount: scheme.amount,
      dept: scheme.dept,
      grant_kind: scheme.grantKind || null,
      desc: scheme.desc,
      eligibility: scheme.eligibility,
      created_at: scheme.created || new Date().toISOString()
    };
    const { data, error } = await supabase.from("schemes").upsert(payload, { onConflict: "id" }).select();
    if (error) {
      console.warn("Supabase client scheme notice:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Supabase client scheme error:", err);
    return null;
  }
}

export async function supabaseSyncApplication(app) {
  if (!app) return null;
  try {
    const payload = {
      id: app.id,
      scheme_id: app.schemeId,
      user_id: app.userId,
      startup_name: app.startupName,
      desc: app.desc,
      file_name: app.fileName || "",
      file_data: app.fileData || "",
      status: app.status || "Registered",
      created_at: app.created || new Date().toISOString(),
      updated_at: app.updated || new Date().toISOString()
    };
    const { data, error } = await supabase.from("applications").upsert(payload, { onConflict: "id" }).select();
    if (error) {
      console.warn("Supabase client application notice:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Supabase client application error:", err);
    return null;
  }
}

