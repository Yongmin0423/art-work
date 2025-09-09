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
      status: commissionFields.status || "pending_approval",
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
  // 1. 먼저 커미션에 연결된 처리 중인 주문이 있는지 확인
  const processingStatuses = ['pending', 'accepted', 'in_progress', 'revision_requested', 'disputed'] as const;
  
  const { data: processingOrders, error: ordersError } = await client
    .from("commission_order")
    .select("order_id, status")
    .eq("commission_id", commissionId)
    .in("status", processingStatuses)
    .limit(1);

  if (ordersError) throw ordersError;

  if (processingOrders && processingOrders.length > 0) {
    throw new Error("처리 중인 주문이 있는 커미션은 삭제할 수 없습니다. 주문이 완료되거나 취소될 때까지 기다려주세요.");
  }

  // 2. 커미션에 연결된 모든 주문들을 먼저 삭제
  const { error: deleteOrdersError } = await client
    .from("commission_order")
    .delete()
    .eq("commission_id", commissionId);

  if (deleteOrdersError) {
    throw new Error("관련 주문 삭제 중 오류가 발생했습니다.");
  }

  // 3. 커미션에 연결된 이미지들 가져오기
  const { data: images, error: imagesError } = await client
    .from("commission_images")
    .select("image_url")
    .eq("commission_id", commissionId);

  if (imagesError) throw imagesError;

  // 4. 스토리지에서 이미지 파일들 삭제
  if (images && images.length > 0) {
    const filePaths: string[] = [];
    
    for (const image of images) {
      try {
        // Supabase storage URL에서 파일 경로 추출
        const urlParts = image.image_url.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'commission-images');
        if (bucketIndex !== -1 && bucketIndex + 1 < urlParts.length) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          filePaths.push(filePath);
        }
      } catch (parseError) {
        console.log("Failed to parse image URL:", parseError);
      }
    }

    if (filePaths.length > 0) {
      const { error: storageError } = await client.storage
        .from("commission-images")
        .remove(filePaths);
      
      if (storageError) {
        console.log("Failed to delete some images from storage:", storageError);
        // 스토리지 삭제 실패해도 DB 삭제는 진행
      }
    }
  }

  // 5. DB에서 커미션 삭제 (cascade로 commission_images도 자동 삭제됨)
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
  // 먼저 현재 좋아요 상태 확인
  const { data: existingLike, error: checkError } = await client
    .from("commission_likes")
    .select("*")
    .eq("commission_id", commissionId)
    .eq("liker_id", userId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("좋아요 상태 확인 에러:", checkError);
    throw checkError;
  }

  if (existingLike) {
    // 좋아요가 이미 있으면 삭제
    const { error: deleteError } = await client
      .from("commission_likes")
      .delete()
      .eq("commission_id", commissionId)
      .eq("liker_id", userId);

    if (deleteError) {
      throw deleteError;
    }

    return { liked: false };
  } else {
    // 좋아요가 없으면 추가
    const { error: insertError } = await client
      .from("commission_likes")
      .insert({
        commission_id: commissionId,
        liker_id: userId,
      });

    if (insertError) {
      throw insertError;
    }

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

export const cancelOrder = async (
  client: SupabaseClient<Database>,
  { orderId, userId }: { orderId: number; userId: string }
) => {
  // 먼저 주문이 존재하고 취소 가능한 상태인지 확인
  const { data: order, error: fetchError } = await client
    .from("commission_order")
    .select("order_id, status, client_id")
    .eq("order_id", orderId)
    .single();

  if (fetchError) throw fetchError;
  if (!order) throw new Error("주문을 찾을 수 없습니다.");

  // 주문한 사람만 취소할 수 있음
  if (order.client_id !== userId) {
    throw new Error("자신이 주문한 커미션만 취소할 수 있습니다.");
  }

  // 취소 가능한 상태인지 확인 (pending, accepted만 취소 가능)
  const cancellableStatuses = ['pending', 'accepted'];
  if (!cancellableStatuses.includes(order.status)) {
    throw new Error("이미 진행 중이거나 완료된 주문은 취소할 수 없습니다.");
  }

  // 주문 상태를 cancelled로 변경
  return await updateOrderStatus(client, { 
    orderId, 
    status: "cancelled" 
  });
};
