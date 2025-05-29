import { cn } from '~/lib/utils';
import { Marquee } from '~/components/magicui/marquee';

const reviews = [
  {
    img: 'https://i.pinimg.com/736x/74/92/b8/7492b8c00912e1d64fdf42649817fac7.jpg',
  },
  {
    img: 'https://i.pinimg.com/736x/ea/e7/53/eae753c181c26661e33f4d5a26de3f34.jpg',
  },
  {
    img: 'https://i.pinimg.com/736x/d1/54/28/d1542843b0d05c2708501feda1bce29b.jpg',
  },
  {
    img: 'https://i.pinimg.com/736x/3b/02/99/3b029986b3a3df7d4f2286e1fd49fc7c.jpg',
  },
  {
    img: 'https://i.pinimg.com/736x/f3/8f/03/f38f03fa255b5fed406c768e3be6475a.jpg',
  },
  {
    img: 'https://i.pinimg.com/736x/4e/6b/46/4e6b46846feb0afb06b4cf6021b996ed.jpg',
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <figure
      className={cn(
        'relative w-64  rounded-xl border p-4',
        // light styles
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        // dark styles
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="size-50"
          alt=""
          src={img}
        />
      </div>
    </figure>
  );
};

export function MarqueeHorizontal() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee
        pauseOnHover
        className="[--duration:20s]"
      >
        {firstRow.map((review) => (
          <ReviewCard
            key={review.img}
            {...review}
          />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        className="[--duration:20s]"
      >
        {secondRow.map((review) => (
          <ReviewCard
            key={review.img}
            {...review}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
