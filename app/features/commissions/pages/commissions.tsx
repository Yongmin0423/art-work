import { Link } from 'react-router';
import { Hero } from '~/components/hero';
import { Button } from '~/components/ui/button';
import ArtistCard from '../components/artist-card';
import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Leaderboard | wemake' },
    { name: 'description', content: 'Top products leaderboard' },
  ];
};

export default function commissios() {
  return (
    <div className="space-y-20">
      <Hero
        title="Leaderboards"
        subtitle="The most popular Artist on artwork"
      />
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Charater-Illustration
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Charater-Illustrator on artwork.
          </p>
          <Button
            variant="link"
            asChild
            className="text-3xl mt-5"
          >
            <Link to="/commissions/character">Explore all products &rarr;</Link>
          </Button>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <ArtistCard
            id={`artist-${index}`}
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Virtual-3D
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Virtual-3D Artist on artwork.
          </p>

          <Button
            variant="link"
            asChild
            className="text-3xl mt-5"
          >
            <Link to="/commissions/virtual-3d">
              Explore all products &rarr;
            </Link>
          </Button>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <ArtistCard
            id={`artist-${index}`}
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Design
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Designer on artwork.
          </p>

          <Button
            variant="link"
            asChild
            className="text-3xl mt-5"
          >
            <Link to="/commissions/design">Explore all products &rarr;</Link>
          </Button>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <ArtistCard
            id={`artist-${index}`}
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Live2D
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Live2D Artist on artwork.
          </p>

          <Button
            variant="link"
            asChild
            className="text-3xl mt-5"
          >
            <Link to="/commissions/live2d">Explore all products &rarr;</Link>
          </Button>
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <ArtistCard
            id={`artist-${index}`}
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
  );
}
