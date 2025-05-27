// app/routes/artist.$artistId.tsx
import { Badge } from '~/components/ui/badge';
import type { Route } from './+types/artist';
import { Button } from '~/components/ui/button';
import { DotIcon } from 'lucide-react';

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

export default function Artist({ loaderData }: Route.ComponentProps) {
  const id = loaderData;

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
      'https://example.com/portfolio1.jpg',
      'https://example.com/portfolio2.jpg',
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
      <div className="bg-gradient-to-tr from-primary/80 to-primary/10 h-60 w-full rounded-lg"></div>
      <div className="grid grid-cols-6 -mt-20 gap-20 items-start">
        <div className="col-span-4 space-y-10">
          <div>
            <div className="size-40 bg-white rounded-full  overflow-hidden relative left-10">
              <img
                src="https://github.com/facebook.png"
                className="object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold">Software Engineer</h1>
            <h4 className="text-lg text-muted-foreground">Meta Inc.</h4>
          </div>
          <div className="flex gap-2">
            <Badge variant={'secondary'}>Full-time</Badge>
            <Badge variant={'secondary'}>Remote</Badge>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Overview</h4>
            <p className="text-lg">
              This is a full-time remote position for a Software Engineer. We
              are looking for a skilled and experienced Software Engineer to
              join our team.
            </p>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Responsibilities</h4>
            <ul className="text-lg list-disc list-inside">
              {[
                'Design and implement scalable and efficient software solutions',
                'Collaborate with cross-functional teams to ensure timely delivery of projects',
                'Optimize software performance and troubleshoot issues',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Qualifications</h4>
            <ul className="text-lg list-disc list-inside">
              {[
                "Bachelor's degree in Computer Science or related field",
                '3+ years of experience in software development',
                'Strong proficiency in JavaScript, TypeScript, and React',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Benefits</h4>
            <ul className="text-lg list-disc list-inside">
              {[
                'Competitive salary',
                'Flexible working hours',
                'Opportunity to work on cutting-edge projects',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2.5">
            <h4 className="text-2xl font-bold">Skills</h4>
            <ul className="text-lg list-disc list-inside">
              {['JavaScript', 'TypeScript', 'React'].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-2 space-y-5 mt-32 sticky top-20 p-6 border rounded-lg">
          <div className="flex flex-col">
            <span className=" text-sm text-muted-foreground">Avg. Salary</span>
            <span className="text-2xl font-medium">$100,000 - $120,000</span>
          </div>
          <div className="flex flex-col">
            <span className=" text-sm text-muted-foreground">Location</span>
            <span className="text-2xl font-medium">Remote</span>
          </div>
          <div className="flex flex-col">
            <span className=" text-sm text-muted-foreground">Type</span>
            <span className="text-2xl font-medium">Full Time</span>
          </div>
          <div className="flex">
            <span className=" text-sm text-muted-foreground">
              Posted 2 days ago
            </span>
            <DotIcon className="size-4" />
            <span className=" text-sm text-muted-foreground">395 views</span>
          </div>
          <Button className="w-full">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
