// app/routes/artist.$artistId.tsx
import { Badge } from '~/components/ui/badge';
import type { Route } from './+types/artist';
import { DotIcon } from 'lucide-react';
import { MarqueeHorizontal } from '~/common/components/marquee-horizontal';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Separator } from '~/components/ui/separator';
import SelectPair from '~/common/components/select-pair';
import PriceSelector from '../components/price-selector';
import { useState } from 'react';
import { Button } from '~/components/ui/button';

export function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  if (!id) {
    throw new Response('ID가 필요합니다', { status: 400 });
  }
  return id;
}

export const meta: Route.MetaFunction = ({ params }) => {
  return [
    { title: `${params.id} - 아티스트 페이지` },
    {
      name: 'description',
      content: `${params.id}의 커미션 상세 페이지입니다.`,
    },
  ];
};

interface CartItem {
  category: string;
  option: string;
  price: number;
}

export default function Artist({ loaderData }: Route.ComponentProps) {
  const id = loaderData;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const artist = {
    id,
    name: `GQuuuuux`,
    description: '캐릭터 일러스트 전문',
    images: [
      'https://i2.ruliweb.com/img/25/03/28/195db744fe120337.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRrwNMHYCP7CVjFghDN7W-P6L6n13ehDxJnQ&s',
    ],
    rating: 4.8,
    likes: 123,
    tags: ['Anime', 'Fantasy', 'Portrait'],
    commissionStatus: '가능',
    priceStart: 50000,
    portfolio: [
      'https://static1.srcdn.com/wordpress/wp-content/uploads/2025/03/mobile-suit-gundam-gquuuuuux-main-cast.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
      'https://www.techoffside.com/wp-content/uploads/2025/03/GQuuuuuuX-Prime-Video-02.jpg',
      'https://m.media-amazon.com/images/M/MV5BZmQwMzZkYTMtNGNjYy00OTI3LTk1NzYtYzU3NzVmZjI5NmM0XkEyXkFqcGdeQVRoaXJkUGFydHlJbmdlc3Rpb25Xb3JrZmxvdw@@._V1_.jpg',
      'https://gundamnews.org/wp-content/uploads/2025/01/photo-output.jpg',
      'https://i.namu.wiki/i/oDX5t2Aq4foxiR_sRPZS9qAZxzUjDv6Jhg3eFqnLxC_E1h6jk1umRGn7-YehMFlGp3DWb9t3HlByO_IVNPo8VQ.webp',
    ],
    bio: '안녕하세요! 캐릭터 일러스트를 전문으로 그리는 아티스트입니다.',
    commissionTypes: [
      { type: '캐릭터 일러스트', price: 50000 },
      { type: '포트레이트', price: 70000 },
      { type: '풀바디 일러스트', price: 100000 },
    ],
  };

  const handlePriceSelection = (category: string, selectedOption: string) => {
    // 가격 추출 (숫자만)
    const priceMatch = selectedOption.match(/(\d+,?\d*)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(',', '')) : 0;

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
        <MarqueeHorizontal />
      </div>
      <div className="grid grid-cols-6 -mt-20 gap-20 items-start">
        <div className="col-span-4 space-y-10">
          <div>
            <div className="size-40 bg-white rounded-full  overflow-hidden relative left-10">
              <img
                src="https://kr.gundam.info/about-gundam/series-pages/gquuuuuux/glh/jp/character/2024/11/img_amateyuzuriha_thumb_01.png"
                className="object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold">
              {artist.name}작가 / 선물용 캐릭터 일러스트레이션 / 방송용 캐릭터
              일러스트레이션
            </h1>
            <h4 className="text-lg text-muted-foreground">
              {artist.description}
            </h4>
          </div>
          <div className="flex gap-2">
            {artist.tags.map((tag) => (
              <Badge
                key={tag}
                variant={'secondary'}
              >
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">About</h4>
            <p className="text-lg">{artist.bio}</p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">커미션 타입 및 가격</h4>
            <ul className="text-lg list-disc list-inside">
              {artist.commissionTypes.map((type) => (
                <li key={type.type}>
                  {type.type} - {type.price.toLocaleString()}원
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">작품 예시</h4>
            <div className="flex flex-col gap-4">
              {artist.portfolio.map((img, idx) => (
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
              <AvatarFallback>N</AvatarFallback>
              <AvatarImage src="https://kr.gundam.info/about-gundam/series-pages/gquuuuuux/glh/jp/character/2024/11/img_amateyuzuriha_thumb_01.png" />
            </Avatar>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">{artist.name}</h4>
              <div className="flex gap-5">
                {artist.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={'secondary'}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>⭐ {artist.rating.toFixed(1)}</span>
                <span>❤️ {artist.likes}</span>
              </div>
              <p
                className={`font-semibold ${
                  artist.commissionStatus === '가능'
                    ? 'text-green-600 border border-green-600 text-center rounded-full px-2'
                    : artist.commissionStatus === '대기 중'
                    ? 'text-yellow-600 border border-yellow-600 text-center rounded-full px-2'
                    : 'text-red-600 border border-red-600 text-center rounded-full px-2'
                }`}
              >
                커미션 {artist.commissionStatus}
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
                <span>2회</span>
              </div>
              <div className="flex justify-between items-center">
                <span>작업기간</span>
                <span>2주</span>
              </div>
              <div className="flex justify-between items-center">
                <span>기본 사이즈</span>
                <span>3000x3000</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex justify-center items-center bg-accent text-accent-foreground text-2xl font-bold rounded-2xl mb-5">
              <h4>커미션 가격</h4>
            </div>
            <div className="space-y-2.5 px-2">
              <div className="w-full">
                <PriceSelector
                  label="상업용"
                  description="상업용으로 사용할 이러스트레이션"
                  name="상업용"
                  placeholder="선택하세요"
                  options={[
                    { label: '(전신): 15,000', value: '(전신): 15,000' },
                    { label: '(반신): 20,000', value: '(반신): 20,000' },
                  ]}
                  onSelectionChange={(value) =>
                    handlePriceSelection('상업용', value)
                  }
                />
              </div>
              <div>
                <PriceSelector
                  label="방송용"
                  description="방송용으로 사용할 이러스트레이션"
                  name="방송용"
                  placeholder="선택하세요"
                  options={[
                    { label: '(전신): 15,000', value: '15,000' },
                    { label: '(반신): 20,000', value: '20,000' },
                  ]}
                  onSelectionChange={(value) =>
                    handlePriceSelection('방송용', value)
                  }
                />
              </div>
              <div>
                <PriceSelector
                  label="비상업용"
                  description="비상업용으로 사용할 이러스트레이션"
                  name="비상업용"
                  placeholder="선택하세요"
                  options={[
                    { label: '(전신): 15,000', value: '(전신): 15,000' },
                    { label: '(반신): 20,000', value: '(반신): 20,000' },
                  ]}
                  onSelectionChange={(value) =>
                    handlePriceSelection('비상업용', value)
                  }
                />
              </div>
              <div>
                <PriceSelector
                  label="기타"
                  description="기타 추가 요소"
                  name="기타"
                  placeholder="선택하세요"
                  options={[
                    { label: '빠른 작업: 3,000', value: '빠른 작업: 3,000' },
                    {
                      label: '다양한 표정: 5,000',
                      value: '다양한 표정: 5,000',
                    },
                  ]}
                  onSelectionChange={(value) =>
                    handlePriceSelection('기타', value)
                  }
                />
              </div>
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
