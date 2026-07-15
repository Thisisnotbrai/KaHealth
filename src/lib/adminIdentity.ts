import { supabase } from "@/supabase-client";

export type AdminIdentity = {
  id: string;
  fullName: string;
  email: string;
};

const ADMIN_IDENTITIES: Record<string, string> = {
  "chiefadmin@kahealth.com": "Chief Admin",
  "kabru@kahealth.com": "KABRU",
};

const ADMIN_EMAILS = Object.keys(ADMIN_IDENTITIES);

export function isKnownAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}

export function getAdminDisplayName(email?: string | null, fallbackName?: string | null) {
  if (email) {
    const canonicalName = ADMIN_IDENTITIES[email.toLowerCase()];
    if (canonicalName) {
      return canonicalName;
    }
  }

  return fallbackName?.trim() || null;
}

export async function getCurrentAdminIdentity(): Promise<AdminIdentity | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const user = userData.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    fullName:
      getAdminDisplayName(user.email, profile?.full_name || user.user_metadata?.full_name) ||
      user.email ||
      "Admin",
    email: user.email || "",
  };
}