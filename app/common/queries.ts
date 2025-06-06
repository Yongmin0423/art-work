import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

// 현재 활성화된 로고 가져오기
export async function getActiveLogo(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from("logo")
    .select("*")
    .eq("is_active", "true")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching active logo:", error);
    return null;
  }

  return data;
}

// 활성화된 카테고리 쇼케이스 이미지들 가져오기 (display_order 순으로 정렬)
export async function getCategoryShowcase(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from("category_showcase")
    .select("*")
    .eq("is_active", "true")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching category showcase:", error);
    return [];
  }

  return data;
}
