import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import { getLoggedInUser } from "~/features/community/queries";
import type { Database } from "~/supa-client";

// 현재 활성화된 로고 가져오기
export async function getActiveLogo(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from("logo")
    .select("*")
    .eq("is_active", "true")
    .limit(1)
    .maybeSingle();

  console.log("[getActiveLogo] data:", data);
  console.log("[getActiveLogo] error:", error);

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

export async function requireAdmin(
  client: SupabaseClient<Database>,
  request: Request
) {
  const user = await getLoggedInUser(client);

  if (user.role !== "admin") {
    throw redirect("/");
  }
  return user; // 관리자 정보 반환
}
