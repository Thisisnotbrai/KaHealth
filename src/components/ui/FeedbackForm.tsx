// components/FeedbackForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/supabase-client";
import { Button } from "./Navbar/button";
import { Textarea } from "./Textarea";
import { Input } from "./Input";
import { toast } from "sonner";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // hidden anti-bot field

  // --- Anti-spam check (localStorage) ---
  function canSubmit(): boolean {
    const last = localStorage.getItem("lastFeedbackTime");
    if (!last) return true;
    const diff = Date.now() - parseInt(last, 10);
    return diff > 5 * 60 * 1000; // 5 minutes cooldown
  }

  function markSubmitted() {
    localStorage.setItem("lastFeedbackTime", Date.now().toString());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit()) {
      toast.error("You can only submit feedback every 5 minutes.");
      return;
    }

    if (honeypot !== "") {
      // Bot detected
      return;
    }

    if (!message.trim()) {
      toast.error("Feedback cannot be empty.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("feedback").insert([
      {
        message,
        created_at: new Date(),
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error("Error submitting feedback.");
      console.error(error);
    } else {
      markSubmitted();
      setMessage("");
      toast.success("Thank you for your feedback!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
          Share your feedback
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-gray-400">
          Tell us what should be clearer, faster, or easier to use.
        </p>
      </div>

      <Textarea
        placeholder="Type your feedback here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[140px] rounded-2xl border-slate-200 bg-white/90 px-4 py-3 shadow-sm focus-visible:ring-emerald-500 dark:border-white/10 dark:bg-white/5"
      />

      {/* Honeypot (hidden field, should stay empty) */}
      <Input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25 disabled:translate-y-0"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
