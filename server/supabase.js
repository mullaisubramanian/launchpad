import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://zkwnoyjuzsogsrwarjpk.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_5MaUW2J_xLa-Mj6uqNuHNw_fttnHEva";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Sync user/profile to Supabase
export async function syncUserToSupabase(user) {
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
      console.warn("⚠️ [Supabase Sync] Profile sync notice:", error.message);
      return null;
    }
    console.log("✅ [Supabase Sync] Profile synced to Supabase:", user.email);
    return data;
  } catch (err) {
    console.warn("⚠️ [Supabase Sync] Profile sync error:", err.message);
    return null;
  }
}

// Find user in Supabase by email and password
export async function findUserInSupabase(email, pass) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .limit(1);

    if (error || !data || data.length === 0) return null;
    const user = data[0];
    if (user.pass && user.pass !== pass) return null; // Password mismatch
    return user;
  } catch (err) {
    console.warn("⚠️ [Supabase Query] Error finding user:", err.message);
    return null;
  }
}

// Sync scheme to Supabase
export async function syncSchemeToSupabase(scheme) {
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
      console.warn("⚠️ [Supabase Sync] Scheme sync notice:", error.message);
      return null;
    }
    console.log("✅ [Supabase Sync] Scheme synced to Supabase:", scheme.name);
    return data;
  } catch (err) {
    console.warn("⚠️ [Supabase Sync] Scheme sync error:", err.message);
    return null;
  }
}

// Sync application to Supabase
export async function syncApplicationToSupabase(app) {
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
      console.warn("⚠️ [Supabase Sync] Application sync notice:", error.message);
      return null;
    }
    console.log("✅ [Supabase Sync] Application synced to Supabase:", app.id);
    return data;
  } catch (err) {
    console.warn("⚠️ [Supabase Sync] Application sync error:", err.message);
    return null;
  }
}

// Sync application status to Supabase
export async function syncApplicationStatusToSupabase(appId, status) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", appId)
      .select();
    if (error) {
      console.warn("⚠️ [Supabase Sync] Status update notice:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("⚠️ [Supabase Sync] Status update error:", err.message);
    return null;
  }
}

