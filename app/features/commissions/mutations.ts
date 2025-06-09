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
  images: string[];
  price_start: number;
  price_options: PriceOption[];
  turnaround_days: number;
  revision_count: number;
  base_size: string;
  status?: "available" | "pending" | "unavailable" | "paused";
};

export const createCommission = async (
  client: SupabaseClient<Database>,
  commissionData: CreateCommissionData
) => {
  const { data, error } = await client
    .from("commission")
    .insert({
      ...commissionData,
      status: commissionData.status || "available",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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
    images?: string[];
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
