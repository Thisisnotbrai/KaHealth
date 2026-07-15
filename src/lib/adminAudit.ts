import { supabase } from "@/supabase-client";

type LogAdminLoginInput = {
  adminId: string;
  adminName: string;
  adminEmail: string;
};

export async function logAdminLogin({ adminId, adminName, adminEmail }: LogAdminLoginInput) {
  const loggedInAt = new Date().toISOString();

  const { error } = await supabase.from("admin_login_logs").insert({
    admin_id: adminId,
    admin_name: adminName,
    admin_email: adminEmail,
    logged_in_at: loggedInAt,
  });

  if (error) {
    throw error;
  }
}