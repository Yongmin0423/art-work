import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';
import { EyeIcon, DotIcon, StarIcon, StarOffIcon } from 'lucide-react';

interface ReviewCardProps {
  reviewId: string;
  title: string;
  artist: string;
  views: number;
  timeAgo: string;
  rating: number; // 0 ~ 5
  image: string;
  description: string;
  writer: string;
}

export function ReviewCard({
  reviewId,
  title,
  artist,
  views,
  timeAgo,
  rating,
  description,
  image,
  writer,
}: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rating ? (
      <StarIcon
        key={i}
        className="size-4 text-yellow-400"
        fill="currentColor"
      />
    ) : (
      <StarOffIcon
        key={i}
        className="size-4 text-muted-foreground"
        fill="currentColor"
      />
    )
  );

  return (
    <Link to={`/reviews/${reviewId}`}>
      <Card className="bg-transparent hover:bg-card/50 transition-colors">
        <div>
          <img
            src={image}
            alt="review image"
          />
          <div>{artist}</div>
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="text-sm">{description}</div>
        </CardHeader>
        <CardContent className="flex items-center text-sm">
          <div className="flex items-center gap-1">
            <EyeIcon className="size-4" />
            <span>{views}</span>
          </div>
          <DotIcon className="size-2" />
          <span>{timeAgo}</span>
          <DotIcon className="size-2" />
          <span>{writer.slice(0, 1)}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-1">{stars}</CardFooter>
      </Card>
    </Link>
  );
}
