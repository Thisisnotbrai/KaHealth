// src/services/carouselService.ts
import { supabase } from "@/supabase-client";

const BUCKET = "carousel";

export const uploadCarouselImage = async (file: File) => {
  const filePath = `${Date.now()}-${file.name}`;
  
  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  const imageUrl = urlData.publicUrl;

  // Insert record into carousel_images
  const { data, error: insertError } = await supabase
    .from("carousel_images")
    .insert([{ image_url: imageUrl }])
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);

  return data;
};

export const deleteCarouselImage = async (id: string, imageUrl: string) => {
  // Delete from storage
  const filePath = imageUrl.split("/").pop(); // crude but works if using publicUrl
  if (filePath) {
    await supabase.storage.from(BUCKET).remove([filePath]);
  }

  // Delete DB record
  const { error } = await supabase
    .from("carousel_images")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
};
