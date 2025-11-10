import { supabase } from "@/supabase-client";

export async function archiveItem(
  table: "events" | "feedback" | "announcements",
  id: string
) {
  // 1️⃣ Get the item data
  const { data: item, error: fetchError } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !item) throw new Error(fetchError?.message || "Item not found");

  // 2️⃣ Insert into archive table
  const archiveTable = `archive_${table}`;
  const { error: insertError } = await supabase
    .from(archiveTable)
    .insert({
      original_id: item.id,
      data: item,
    });

  if (insertError) throw new Error(insertError.message);

  // 3️⃣ Delete original
  const { error: deleteError } = await supabase.from(table).delete().eq("id", id);

  if (deleteError) throw new Error(deleteError.message);

  return true;
}
