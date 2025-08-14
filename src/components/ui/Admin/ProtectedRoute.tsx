import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { supabase } from "@/supabase-client";

type Status = "checking" | "allowed" | "denied";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<Status>("checking");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {
      // Step 1: Check active session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (!cancelled) setStatus("denied");
        return;
      }

      // Step 2: Fetch role from profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (cancelled) return;

      if (error || !data || data.role !== "admin") {
        setStatus("denied");
      } else {
        setStatus("allowed");
      }
    };

    checkAccess();
    return () => { cancelled = true; };
  }, []);

  // Step 3: Handle loading
  if (status === "checking") {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Checking access...
      </div>
    );
  }

  // Step 4: Redirect if not allowed
  if (status === "denied") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Step 5: Render protected page
  return children;
}
