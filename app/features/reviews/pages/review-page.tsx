import { DotIcon, HeartIcon } from 'lucide-react';
import { EyeIcon } from 'lucide-react';
import { Hero } from '~/components/hero';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';

export const meta = () => {
  return [
    { title: `IdeasGPT | wemake` },
    {
      name: 'description',
      content: 'Find ideas for your next project',
    },
  ];
};

export default function ReviewPage() {
  const artist = {
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

  return (
    <div>
      <Hero title="그림이 너무 이뻐요" />
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center">
          <img
            className="rounded-2xl w-2/3"
            src="https://i2.ruliweb.com/img/25/04/30/19686c7bd2a137db4.jpg"
          />
          <div className="border-2 border-gray-200 rounded-lg p-5 mt-5">
            <Link to="/commissions/artist/gquuuuuux">
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
            </Link>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-10">
          <p className="italic text-center">
            "작가님이 그림을 너무 제 스타일에 맞게 잘 그려주셨어요! 마감 기한
            내에 제대로 된 작품을 만들어주셔서 정말 감사합니다!"
          </p>
          <p>유**</p>
          <div className="flex items-center text-sm">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>123</span>
            </div>
            <DotIcon className="w-4 h-4" />
            <span>12 hours ago</span>
            <DotIcon className="w-4 h-4" />
            <Button variant="outline">
              <HeartIcon className="w-4 h-4" />
              <span>12</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
