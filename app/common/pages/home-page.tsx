import CategoryCard from '~/components/category-card';
import { Hero } from '~/components/hero';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import ArtistCard from '~/features/commissions/components/artist-card';

export const meta = () => {
  return [
    {
      title: 'Home | artwork',
    },
    {
      name: 'description',
      content: 'Home Page of artwork',
    },
  ];
};

export default function HomePage() {
  return (
    <div>
      <div className="grid grid-cols-6 h-full">
        <div className="flex flex-col  h-full col-span-4">
          <Hero
            title="Make a your own art with the best Artist"
            subtitle="find your favorite artist and make a your own art"
          />
          <div className="flex w-2/3 mx-auto gap-5">
            <Input
              placeholder="search by art,artist etc.."
              className="w-full"
            />
            <Button>Search</Button>
          </div>
        </div>
        <div className="col-span-2">
          <img
            src="https://cdn.gameinsight.co.kr/news/photo/202211/25171_64125_5958.jpg"
            alt="home page img"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="mb-10">
        <h1 className="font-bold text-3xl">Category</h1>
        <div className="grid grid-cols-4 gap-10 ">
          {Array.from({ length: 4 }).map((_, index) => (
            <CategoryCard
              key={index}
              title="charater"
              imageUrl="https://i.namu.wiki/i/R-92H0KLN-wen6aNLzERBpLNtAU6o8QTzwjI0cbKGVpyrIWart56j-NhtiOwtDd1EIRy-hQg0jLgbSRIZ_CJoQ.webp"
            />
          ))}
        </div>
      </div>
      <div>
        <h1 className="font-bold text-3xl mb-5">Famous Artist</h1>
        <div className="grid grid-cols-4 gap-10 ">
          {Array.from({ length: 4 }).map((_, index) => (
            <ArtistCard
              key={index}
              name="GQuuuuux"
              description="캐릭터 일러스트 전문"
              images={[
                'https://i2.ruliweb.com/img/25/03/28/195db744fe120337.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRrwNMHYCP7CVjFghDN7W-P6L6n13ehDxJnQ&s',
              ]}
              rating={4.8}
              likes={123}
              tags={['Anime', 'Fantasy', 'Portrait']}
              commissionStatus="가능"
              priceStart={50000}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
