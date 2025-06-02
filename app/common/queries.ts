import { eq, desc } from "drizzle-orm";
import db from "~/db";
import { logo, category_showcase } from "./schema";

// 현재 활성화된 로고 가져오기
export async function getActiveLogo() {
  try {
    const result = await db
      .select()
      .from(logo)
      .where(eq(logo.is_active, "true"))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching active logo:", error);
    return null;
  }
}

// 활성화된 카테고리 쇼케이스 이미지들 가져오기 (display_order 순으로 정렬)
export async function getCategoryShowcase() {
  try {
    const result = await db
      .select()
      .from(category_showcase)
      .where(eq(category_showcase.is_active, "true"))
      .orderBy(category_showcase.display_order);

    return result;
  } catch (error) {
    console.error("Error fetching category showcase:", error);
    return [];
  }
}
