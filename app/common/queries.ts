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

  // storage_path에서 publicUrl 생성
  return data.map((item) => {
    const { data: { publicUrl } } = client.storage
      .from("category-images")
      .getPublicUrl(item.storage_path);
    
    return {
      ...item,
      image_url: publicUrl, // BentoDemo에서 사용할 수 있도록 image_url 필드 추가
    };
  });
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
