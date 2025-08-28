import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import type { CommissionCategory } from "../../common/category-enums";

type PriceChoice = {
  label: string;
  price: number;
  description?: string;
};

type PriceOption = {
  type: string;
  choices: PriceChoice[];
};

type CreateCommissionData = {
  profile_id: string;
  title: string;
  description: string;
  category: CommissionCategory;
  tags: string[];
  price_start: number;
  price_options: PriceOption[];
  turnaround_days: number;
  revision_count: number;
  base_size: string;
  status?: "available" | "pending" | "unavailable" | "paused";
  images?: string[];
};

type CreateCommissionOrderData = {
  commission_id: number;
  client_id: string;
  profile_id: string;
  selected_options: Array<{
    type: string;
    choice: string;
    price: number;
  }>;
  total_price: number;
  requirements?: string;
};

export const createCommission = async (
  client: SupabaseClient<Database>,
  commissionData: CreateCommissionData
) => {
  const { images, ...commissionFields } = commissionData;

  // 1. commission 테이블에 기본 데이터 저장
  const { data: commission, error: commissionError } = await client
    .from("commission")
    .insert({
      ...commissionFields,
      status: commissionFields.status || "available",
    })
    .select()
    .single();

  if (commissionError) throw commissionError;

  // 2. 이미지가 있다면 commission_images 테이블에 저장
  if (images && images.length > 0) {
    const imageInserts = images.map((image_url, index) => ({
      commission_id: commission.commission_id,
      image_url,
      display_order: index,
    }));

    const { error: imagesError } = await client
      .from("commission_images")
      .insert(imageInserts);

    if (imagesError) throw imagesError;
  }

  return commission;
};

export const createCommissionImage = async (
  client: SupabaseClient<Database>,
  {
    commission_id,
    image_url,
    display_order,
  }: {
    commission_id: number;
    image_url: string;
    display_order: number;
  }
) => {
  const { data, error } = await client
    .from("commission_images")
    .insert({
      commission_id,
      image_url,
      display_order,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCommissionImage = async (
  client: SupabaseClient<Database>,
  imageId: number,
  {
    image_url,
    display_order,
  }: {
    image_url?: string;
    display_order?: number;
  }
) => {
  const { data, error } = await client
    .from("commission_images")
    .update({
      image_url,
      display_order,
    })
    .eq("image_id", imageId)
    .select()
    .single();


  if (error) throw error;
  return data;
};

export const deleteCommissionImage = async (
  client: SupabaseClient<Database>,
  imageId: number
) => {
  const { error } = await client
    .from("commission_images")
    .delete()
    .eq("image_id", imageId);


  if (error) throw error;
};

export const updateCommission = async (
  client: SupabaseClient<Database>,
  {
    commissionId,
    ...updateData
  }: {
    commissionId: number;
    title?: string;
    description?: string;
    category?: CommissionCategory;
    tags?: string[];
    price_start?: number;
    price_options?: PriceOption[];
    turnaround_days?: number;
    revision_count?: number;
    base_size?: string;
    status?: "available" | "pending" | "unavailable" | "paused";
  }
) => {
  const { data, error } = await client
    .from("commission")
    .update(updateData)
    .eq("commission_id", commissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCommission = async (
  client: SupabaseClient<Database>,
  { commissionId }: { commissionId: number }
) => {
  const { error } = await client
    .from("commission")
    .delete()
    .eq("commission_id", commissionId);


  if (error) throw error;
};

export const toggleCommissionLike = async (
  client: SupabaseClient<Database>,
  { commissionId, userId }: { commissionId: number; userId: string }
) => {
  console.log(`좋아요 토글 시작: commissionId=${commissionId}, userId=${userId}`);
  
  // 먼저 현재 좋아요 상태 확인
  const { data: existingLike, error: checkError } = await client
    .from("commission_likes")
    .select("*")
    .eq("commission_id", commissionId)
    .eq("liker_id", userId)
    .single();

  console.log(`기존 좋아요 상태:`, existingLike);
  if (checkError && checkError.code !== "PGRST116") {
    console.error("좋아요 상태 확인 에러:", checkError);
    throw checkError;
  }

  console.log("트리거가 자동으로 likes_count를 업데이트할 예정");

  if (existingLike) {
    console.log("좋아요 취소 시작");
    
    // 좋아요가 이미 있으면 삭제
    const { error: deleteError } = await client
      .from("commission_likes")
      .delete()
      .eq("commission_id", commissionId)
      .eq("liker_id", userId);

    if (deleteError) {
      console.error("좋아요 삭제 에러:", deleteError);
      throw deleteError;
    }
    console.log("좋아요 삭제 성공 - 트리거가 자동으로 카운트를 감소시킬 예정");

    return { liked: false };
  } else {
    console.log("좋아요 추가 시작");
    
    // 좋아요가 없으면 추가
    const { error: insertError } = await client
      .from("commission_likes")
      .insert({
        commission_id: commissionId,
        liker_id: userId,
      });

    if (insertError) {
      console.error("좋아요 추가 에러:", insertError);
      throw insertError;
    }
    console.log("좋아요 추가 성공 - 트리거가 자동으로 카운트를 증가시킬 예정");

    return { liked: true };
  }
};

export const createCommissionOrder = async (
  client: SupabaseClient<Database>,
  orderData: CreateCommissionOrderData
) => {
  const { data, error } = await client
    .from("commission_order")
    .insert({
      commission_id: orderData.commission_id,
      client_id: orderData.client_id,
      profile_id: orderData.profile_id,
      selected_options: orderData.selected_options,
      total_price: orderData.total_price,
      requirements: orderData.requirements,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (
  client: SupabaseClient<Database>,
  {
    orderId,
    status,
  }: {
    orderId: number;
    status:
      | "pending"
      | "accepted"
      | "in_progress"
      | "revision_requested"
      | "completed"
      | "cancelled"
      | "refunded"
      | "disputed";
  }
) => {
  const { data, error } = await client
    .from("commission_order")
    .update({ status })
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
