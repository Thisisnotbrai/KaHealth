"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { Button } from "../Navbar/button";

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/admin/login"); // Redirect if not logged in
      } else {
        setUserEmail(data.user.email ?? null);
      }
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium">{userEmail}</span>
        </p>

        {/* Sections to build next */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📢 Announcements</h2>
          <p className="text-muted-foreground">Create and manage announcements here.</p>
          {/* Coming Soon: Form + Post to Supabase */}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">🖼️ Carousel Images</h2>
          <p className="text-muted-foreground">Upload and manage carousel images here.</p>
          {/* Coming Soon: File Upload + Preview + Supabase Storage */}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
