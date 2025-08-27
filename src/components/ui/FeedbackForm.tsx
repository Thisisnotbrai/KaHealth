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
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Share Your Feedback
      </h2>

      <Textarea
        placeholder="Type your feedback here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px]"
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
        className="w-full hover:scale-105 transition-transform"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
