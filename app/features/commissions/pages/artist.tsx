// app/routes/artist.$artistId.tsx
import { Badge } from "~/components/ui/badge";
import type { Route } from "./+types/artist";
import { DotIcon } from "lucide-react";
import { MarqueeHorizontal } from "~/common/components/marquee-horizontal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import SelectPair from "~/common/components/select-pair";
import PriceSelector from "../components/price-selector";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { getCommissionById } from "../queries";

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `${params.id} - 아티스트 페이지` },
    {
      name: "description",
      content: `${params.id}의 커미션 상세 페이지입니다.`,
    },
  ];
};

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const commission = await getCommissionById({ commissionId: Number(id) });

  if (!id) {
    throw new Response("ID가 필요합니다", { status: 400 });
  }
  return { commission };
}

interface CartItem {
  category: string;
  option: string;
  price: number;
}

interface PriceOption {
  type: string;
  price: number;
  description?: string;
}

export default function Artist({ loaderData }: Route.ComponentProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // price_options JSON 파싱
  const priceOptions: PriceOption[] = Array.isArray(
    loaderData.commission.price_options
  )
    ? (loaderData.commission.price_options as unknown as PriceOption[])
    : [];

  // status를 한국어로 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "가능";
      case "pending":
        return "대기 중";
      case "unavailable":
        return "불가";
      case "paused":
        return "일시정지";
      default:
        return status;
    }
  };

  const handlePriceSelection = (category: string, selectedOption: string) => {
    // 가격 추출 (숫자만)
    const priceMatch = selectedOption.match(/(\d+,?\d*)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(",", "")) : 0;

    // 같은 카테고리의 기존 항목 제거
    const filteredItems = cartItems.filter(
      (item) => item.category !== category
    );

    // 새 항목 추가
    if (price > 0) {
      setCartItems([
        ...filteredItems,
        {
          category,
          option: selectedOption,
          price,
        },
      ]);
    } else {
      setCartItems(filteredItems);
    }
  };

  const removeCartItem = (category: string) => {
    setCartItems(cartItems.filter((item) => item.category !== category));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="w-full rounded-lg">
        <MarqueeHorizontal images={loaderData.commission.images} />
      </div>
      <div className="grid grid-cols-6 -mt-20 gap-20 items-start">
        <div className="col-span-4 space-y-10">
          <div>
            <div className="size-40 bg-white rounded-full overflow-hidden relative left-10">
              <img
                src={
                  loaderData.commission.artist_avatar_url ||
                  "https://via.placeholder.com/160"
                }
                alt={`${loaderData.commission.artist_name} 프로필`}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-4xl font-bold">
              {loaderData.commission.title}
            </h1>
            <h4 className="text-lg text-muted-foreground">
              {loaderData.commission.artist_name}
            </h4>
          </div>
          <div className="flex gap-2">
            {loaderData.commission.tags.map((tag) => (
              <Badge key={tag} variant={"secondary"}>
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">About</h4>
            <p className="text-lg">{loaderData.commission.artist_bio}</p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">커미션 타입 및 가격</h4>
            <ul className="text-lg list-disc list-inside">
              {priceOptions.map((option, index) => (
                <li key={index}>
                  {option.type} - {option.price.toLocaleString()}원
                  {option.description && (
                    <span className="text-sm text-gray-600">
                      {" "}
                      ({option.description})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">작품 예시</h4>
            <div className="flex flex-col gap-4">
              {loaderData.commission.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`포트폴리오 이미지 ${idx + 1}`}
                  className="full full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 space-y-5 mt-32 sticky top-20 p-6 border rounded-lg">
          <div className="flex gap-5">
            <Avatar className="size-14">
              <AvatarFallback>
                {loaderData.commission.artist_name?.[0] || "A"}
              </AvatarFallback>
              {loaderData.commission.artist_avatar_url && (
                <AvatarImage src={loaderData.commission.artist_avatar_url} />
              )}
            </Avatar>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">
                {loaderData.commission.artist_name}
              </h4>
              <div className="flex gap-5">
                {loaderData.commission.tags.map((tag) => (
                  <Badge key={tag} variant={"secondary"}>
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>
                  ⭐{" "}
                  {loaderData.commission.artist_avg_rating?.toFixed(1) || "N/A"}
                </span>
                <span>
                  ❤️ {loaderData.commission.artist_followers_count || 0}
                </span>
              </div>
              <p
                className={`font-semibold ${
                  getStatusText(loaderData.commission.status || "") === "가능"
                    ? "text-green-600 border border-green-600 text-center rounded-full px-2"
                    : getStatusText(loaderData.commission.status || "") ===
                      "대기 중"
                    ? "text-yellow-600 border border-yellow-600 text-center rounded-full px-2"
                    : "text-red-600 border border-red-600 text-center rounded-full px-2"
                }`}
              >
                커미션 {getStatusText(loaderData.commission.status || "")}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex justify-center items-center bg-accent text-accent-foreground text-2xl font-bold rounded-2xl mb-5">
              <h4>상세 옵션</h4>
            </div>
            <div className="space-y-2.5 px-2">
              <div className="flex justify-between items-center">
                <span>수정 횟수</span>
                <span>{loaderData.commission.revision_count || 0}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span>작업기간</span>
                <span>{loaderData.commission.turnaround_days || 0}일</span>
              </div>
              <div className="flex justify-between items-center">
                <span>기본 사이즈</span>
                <span>{loaderData.commission.base_size || "N/A"}</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex justify-center items-center bg-accent text-accent-foreground text-2xl font-bold rounded-2xl mb-5">
              <h4>커미션 가격</h4>
            </div>
            <div className="space-y-2.5 px-2">
              {priceOptions.length > 0 ? (
                priceOptions.map((option, index) => (
                  <div key={index} className="w-full">
                    <PriceSelector
                      label={option.type}
                      description={
                        option.description ||
                        `${option.type}으로 사용할 이러스트레이션`
                      }
                      name={option.type}
                      placeholder="선택하세요"
                      options={[
                        {
                          label: `${option.price.toLocaleString()}원`,
                          value: `${option.price.toLocaleString()}원`,
                        },
                      ]}
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
                <div className="flex justify-center items-center bg-accent text-accent-foreground text-2xl font-bold rounded-2xl mb-5">
                  <h4>선택한 옵션</h4>
                </div>
                <div className="space-y-2 px-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.category}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700">
                          {item.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.option}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {item.price.toLocaleString()}원
                        </span>
                        <button
                          onClick={() => removeCartItem(item.category)}
                          className="text-red-500 hover:text-red-700 text-sm"
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
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>총 가격</span>
                  <span className="text-blue-600">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </>
          )}
          <Button className="w-full">결제하기</Button>
        </div>
      </div>
    </div>
  );
}
