import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { supabase } from "@/supabase-client";
import { isKnownAdminEmail } from "@/lib/adminIdentity";

type Status = "checking" | "allowed" | "denied";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<Status>("checking");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (!cancelled) setStatus("denied");
        return;
      }


      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", session.user.id)
        .maybeSingle();

      if (cancelled) return;

      const email = data?.email || session.user.email;

      if (!isKnownAdminEmail(email)) {
        setStatus("denied");
      } else {
        setStatus("allowed");
      }
    };

    checkAccess();
    return () => { cancelled = true; };
  }, []);


  if (status === "checking") {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Checking access...
      </div>
    );
  }


  if (status === "denied") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }


  return children;
}
