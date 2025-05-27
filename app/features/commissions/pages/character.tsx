import ArtistCard from '../components/artist-card';
import CommissionsPagination from '../components/commissions-pagination';
import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Character Commission' }];
};

export default function Character() {
  return (
    <>
      <div className="grid grid-cols-4 gap-10 w-full  ">
        {Array.from({ length: 12 }).map((_, index) => (
          <ArtistCard
            key={index}
            id={`artist-${index}`}
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
      <CommissionsPagination totalPages={10} />
    </>
  );
}
