// create-chief-admin.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "chiefadmin@kahealth.com",
    password: "KabruChief123",
    email_confirm: true,
  });

  if (error) console.error("Failed to create user:", error.message);
  else console.log("Admin created:", data.user);
})();