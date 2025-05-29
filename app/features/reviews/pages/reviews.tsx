import { Hero } from '~/components/hero';
import { ReviewCard } from '../components/review-card';
import type { Route } from './+types/reviews';

export const meta: Route.MetaFunction = () => {
  return [
    { title: '후기 | artwork' },
    {
      name: 'description',
      content: '작가님의 작품 후기를 확인하세요.',
    },
  ];
};

export default function IdeasPage() {
  return (
    <div className="space-y-20">
      <Hero
        title="후기"
        subtitle="작가님의 작품 후기를 확인하세요."
      />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <ReviewCard
            key={`ideaId-${index}`}
            reviewId={`ideaId-${index}`}
            title="그림이 너무 이뻐요"
            artist="GQuuuuux"
            views={123}
            timeAgo="12 hours ago"
            rating={2}
            image="https://i2.ruliweb.com/img/25/04/30/19686c7bd2a137db4.jpg"
            description="작가님이 그림을 너무 제 스타일에 맞게 잘 그려주셨어요! 마감 기한 내에 제대로 된 작품을 만들어주셔서 정말 감사합니다!"
            writer="유저이름"
          />
        ))}
      </div>
    </div>
  );
}
