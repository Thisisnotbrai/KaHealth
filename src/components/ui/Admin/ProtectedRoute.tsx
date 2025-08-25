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

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        if (!cancelled) setStatus("denied");
        return;
      }


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
