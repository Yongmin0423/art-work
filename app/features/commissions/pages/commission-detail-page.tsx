// app/routes/artist.$artistId.tsx
import { Badge } from "~/components/ui/badge";
import type { Route } from "./+types/commission-detail-page";
import { DotIcon, MoreVertical } from "lucide-react";
import { MarqueeHorizontal } from "~/common/components/marquee-horizontal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import SelectPair from "~/components/select-pair";
import PriceSelector from "../components/price-selector";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { getCommissionById } from "../queries";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";
import { toggleCommissionLike } from "../mutations";
import { Form, Link, redirect, useFetcher, useNavigate } from "react-router";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { createCommissionOrder } from "../mutations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface CartItem {
  id: string;
  category: string;
  option: string;
  price: number;
  quantity: number;
}

interface PriceChoice {
  label: string;
  price: number;
  description?: string;
}

interface PriceOption {
  type: string;
  choices: PriceChoice[];
}

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `${params.id} - 아티스트 페이지` },
    {
      name: "description",
      content: `${params.id}의 커미션 상세 페이지입니다.`,
    },
  ];
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const { id } = params;
  const { client, headers } = makeSSRClient(request);
  const commission = await getCommissionById(client, {
    commissionId: Number(id),
  });

  if (!id) {
    throw new Response("ID가 필요합니다", { status: 400 });
  }

  let isAuthor = false;
  try {
    const user = await getLoggedInUser(client);
    if (user) {
      isAuthor = user.profile_id === commission.profile_id;
    }
  } catch (error) {
    // 로그인 하지 않은 경우 isAuthor 는 false
  }

  return { commission, isAuthor };
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("action");
  const { client } = makeSSRClient(request);

  // 먼저 로그인 확인 (공통)
  let user;
  try {
    user = await getLoggedInUser(client);
  } catch (error) {
    return { error: "로그인이 필요합니다." };
  }

  if (actionType === "order") {
    // 커미션 정보 가져오기
    const commission = await getCommissionById(client, {
      commissionId: Number(params.id),
    });

    // 폼 데이터 파싱
    const selectedOptions = JSON.parse(
      formData.get("selected_options") as string
    );
    const totalPrice = Number(formData.get("total_price"));
    const requirements = formData.get("requirements") as string;

    try {
      // 주문 생성
      await createCommissionOrder(client, {
        commission_id: Number(params.id),
        client_id: user.profile_id,
        profile_id: commission.profile_id,
        selected_options: selectedOptions,
        total_price: totalPrice,
        requirements: requirements,
      });

      // 성공 시 일단은 현재 페이지를 새로고침
      return redirect(`/commissions/artist/${params.id}`);
    } catch (error) {
      console.error("주문 생성 중 오류 발생:", error);
      return { error: "주문 생성 중 오류가 발생했습니다." };
    }
  }

  return null;
};

export default function Artist({ loaderData }: Route.ComponentProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthor } = loaderData;
  const deleteFetcher = useFetcher();
  const navigate = useNavigate();

  // 수량 변경 함수
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 수량 증가 함수
  const increaseQuantity = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  // 수량 감소 함수
  const decreaseQuantity = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  // price_options JSON 파싱
  const priceOptions: PriceOption[] = Array.isArray(
    loaderData.commission.price_options
  )
    ? (loaderData.commission.price_options as unknown as PriceOption[])
    : [];

  const handlePriceSelection = (category: string, selectedOption: string) => {
    // 가격 추출 (- 뒤의 숫자,숫자원 패턴)
    const priceMatch = selectedOption.match(/- ([\d,]+)원/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, "")) : 0;

    const id = `${category}-${selectedOption}`;

    const existingItem = cartItems.find((item) => item.id === id);

    if (existingItem) {
      updateQuantity(id, existingItem.quantity + 1);
    } else if (price > 0) {
      setCartItems([
        ...cartItems,
        {
          id,
          category,
          option: selectedOption,
          price,
          quantity: 1,
        },
      ]);
    }
  };

  const removeCartItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleDelete = () => {
    if (confirm("정말로 이 커미션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      deleteFetcher.submit({}, {
        method: "post",
        action: `/commissions/${loaderData.commission.commission_id}/delete`
      });
    }
  };

  // 삭제 성공 시 리다이렉트
  useEffect(() => {
    if (deleteFetcher.data?.success) {
      navigate("/commissions");
    }
  }, [deleteFetcher.data, navigate]);

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="w-full rounded-lg">
        <MarqueeHorizontal images={loaderData.commission.images} />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-6 gap-8 lg:gap-20 -mt-20">
        <div className="lg:col-span-4 space-y-8 md:space-y-10">
          <div>
            <div className="size-28 md:size-40 bg-white rounded-full overflow-hidden relative left-6 md:left-10">
              <img
                src={
                  loaderData.commission.artist_avatar_url ||
                  "https://via.placeholder.com/160"
                }
                alt={`${loaderData.commission.artist_name} 프로필`}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">
              {loaderData.commission.title}
            </h1>
            <h4 className="text-base md:text-lg text-muted-foreground">
              {loaderData.commission.artist_name}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {loaderData.commission.tags.map((tag) => (
              <Badge key={tag} variant={"secondary"}>
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-xl md:text-xl font-bold">작가 소개말</h4>
            <p className="text-base md:text-lg">
              {loaderData.commission.artist_bio}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xl md:text-xl font-bold">설명</h4>
            <p>{loaderData.commission.description}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xl md:text-xl font-bold">작품 예시</h4>
            <div className="flex flex-col gap-4">
              {loaderData.commission.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`커미션 이미지 ${idx + 1}`}
                  className="w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
        {/*오른쪽 주문 섹션 */}
        <div className="lg:col-span-2 space-y-5 mt-8 lg:mt-32 lg:sticky lg:top-20">
          <Form
            method="post"
            className="border rounded-lg p-4 md:p-6 space-y-5"
          >
            <div className="flex justify-between">
              <div className="flex gap-4 md:gap-5">
                <Avatar className="size-12 md:size-14">
                  <AvatarFallback>
                    {loaderData.commission.artist_name?.[0] || "A"}
                  </AvatarFallback>
                  {loaderData.commission.artist_avatar_url && (
                    <AvatarImage
                      src={loaderData.commission.artist_avatar_url}
                    />
                  )}
                </Avatar>
                <div className="flex flex-col gap-2">
                  <h4 className="text-base md:text-lg font-bold">
                    {loaderData.commission.artist_name}
                  </h4>
                  <div className="flex flex-wrap gap-2 md:gap-5">
                    {loaderData.commission.tags.map((tag) => (
                      <Badge key={tag} variant={"secondary"}>
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs md:text-sm">
                    <span>
                      ⭐{" "}
                      {loaderData.commission.artist_avg_rating?.toFixed(1) ||
                        "N/A"}
                    </span>
                    <span>❤️ {loaderData.commission.likes_count || 0}</span>
                  </div>
                </div>
              </div>
              {isAuthor && (
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">액션 메뉴</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/commissions/edit/${loaderData.commission.commission_id}`}
                        >
                          수정하기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer"
                        onClick={handleDelete}
                      >
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <Separator />
            <div>
              <div className="flex justify-center items-center bg-accent text-accent-foreground text-xl md:text-2xl font-bold rounded-2xl mb-4 md:mb-5">
                <h4 className="text-xl py-1">상세 옵션</h4>
              </div>
              <div className="space-y-2 px-2">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span>수정 횟수</span>
                  <span>{loaderData.commission.revision_count || 0}회</span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span>작업기간</span>
                  <span>{loaderData.commission.turnaround_days || 0}일</span>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span>기본 사이즈</span>
                  <span>{loaderData.commission.base_size || "N/A"}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex justify-center items-center bg-accent text-accent-foreground text-xl md:text-2xl font-bold rounded-2xl mb-4 md:mb-5">
                <h4 className="text-xl py-1">커미션 가격</h4>
              </div>
              <div className="space-y-2 px-2">
                {priceOptions.length > 0 ? (
                  priceOptions.map((option, index) => (
                    <div key={index} className="w-full">
                      <PriceSelector
                        label={option.type}
                        description={`${option.type}으로 사용할 이러스트레이션`}
                        name={option.type}
                        placeholder="선택하세요"
                        options={option.choices.map((choice) => ({
                          label: `${
                            choice.label
                          } - ${choice.price.toLocaleString()}원`,
                          value: `${
                            choice.label
                          } - ${choice.price.toLocaleString()}원`,
                        }))}
                        onSelectionChange={(value) =>
                          handlePriceSelection(option.type, value)
                        }
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">가격 정보가 없습니다.</p>
                )}
              </div>
            </div>

            {/* 장바구니 섹션 */}
            {cartItems.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex justify-center items-center bg-accent text-accent-foreground text-xl md:text-2xl font-bold rounded-2xl mb-4 md:mb-5">
                    <h4 className="text-xl py-1">선택한 옵션</h4>
                  </div>

                  <div className="space-y-2 px-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.category}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="text-xs md:text-sm font-medium text-gray-700">
                            {item.category}
                          </div>
                          <div className="text-xs md:text-sm text-gray-500">
                            {item.option}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* 수량 조절 버튼 */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs md:text-sm font-medium">
                            {(item.price * item.quantity).toLocaleString()}원
                          </span>
                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs md:text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="px-2">
                  <div className="flex justify-between items-center text-lg md:text-xl font-bold">
                    <span>총 가격</span>
                    <span className="text-blue-600">
                      {totalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* 주문 요구사항 입력 */}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="requirements">주문 요구사항</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="작업에 대한 구체적인 요구사항을 입력해주세요..."
                rows={4}
              />
            </div>

            {/* 숨겨진 데이터 */}
            <input type="hidden" name="action" value="order" />
            <input
              type="hidden"
              name="selected_options"
              value={JSON.stringify(cartItems)}
            />
            <input type="hidden" name="total_price" value={totalPrice} />

            <Button
              type="submit"
              className="w-full"
              disabled={cartItems.length === 0}
            >
              주문하기 ({totalPrice.toLocaleString()}원)
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
