"use client";

import { useState } from "react";
import { supabase } from "@/supabase-client";
import { Button } from "../../Navbar/button";
import { Input } from "../../Input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useToast } from "../../ToastProvider";

export default function AddMedicineForm() {
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    form: "",
    stock: "",
    expiry_date: "",
    requires_prescription: false,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("medicines").insert([
      {
        name: form.name,
        dosage: form.dosage,
        form: form.form,
        stock: Number(form.stock),
        expiry_date: form.expiry_date,
        requires_prescription: form.requires_prescription,
      },
    ]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Success", description: "Medicine added successfully!" });

    setForm({
      name: "",
      dosage: "",
      form: "",
      stock: "",
      expiry_date: "",
      requires_prescription: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white dark:bg-[#162942] rounded-xl shadow-md"
    >
      <div>
        <Label className="text-gray-900 dark:text-gray-100">Name</Label>
        <Input
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
          className="!text-gray-900 dark:!text-white"
        />
      </div>

      <div>
        <Label className="text-gray-900 dark:text-gray-100">Dosage</Label>
        <Input
          placeholder="e.g., 500mg"
          value={form.dosage}
          onChange={(e) => updateField("dosage", e.target.value)}
          className="text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <Label className="text-gray-900 dark:text-gray-100">Form</Label>
        <Input
          placeholder="Tablet, Syrup, Capsule..."
          value={form.form}
          onChange={(e) => updateField("form", e.target.value)}
          className="text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <Label className="text-gray-900 dark:text-gray-100">Stock</Label>
        <Input
          type="number"
          value={form.stock}
          onChange={(e) => updateField("stock", e.target.value)}
          required
          className="text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <Label className="text-gray-900 dark:text-gray-100">Expiry Date</Label>
        <Input
          type="date"
          value={form.expiry_date}
          onChange={(e) => updateField("expiry_date", e.target.value)}
          className="text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.requires_prescription}
          onChange={(e) => updateField("requires_prescription", e.target.checked)}
          className="w-4 h-4"
        />
        <Label className="text-gray-900 dark:text-gray-100">Requires Prescription</Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Medicine"}
      </Button>
    </form>
  );
}