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

  console.log("[createCommissionImage] data:", data);
  console.log("[createCommissionImage] error:", error);

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

  console.log("[updateCommissionImage] data:", data);
  console.log("[updateCommissionImage] error:", error);

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

  console.log("[deleteCommissionImage] error:", error);

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

  console.log("[updateCommission] data:", data);
  console.log("[updateCommission] error:", error);

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

  console.log("[deleteCommission] error:", error);

  if (error) throw error;
};
