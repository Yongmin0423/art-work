import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Heart } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Link } from 'react-router';

type ArtistCardProps = {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating: number;
  likes: number;
  tags: string[];
  commissionStatus: '가능' | '대기 중' | '불가';
  priceStart: number;
};

export default function ArtistCard({
  id,
  name,
  description,
  images,
  rating,
  likes,
  tags,
  commissionStatus,
  priceStart,
}: ArtistCardProps) {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <Link
        to={`/commissions/artist/${id}`}
        className="cursor-pointer"
      >
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-2">
          {images.slice(0, 2).map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`작품 ${idx + 1}`}
              className="rounded object-cover w-full h-40"
            />
          ))}
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>⭐ {rating.toFixed(1)}</span>
          <span>❤️ {likes}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <Badge key={idx}>#{tag}</Badge>
          ))}
        </div>

        <div className="flex justify-between items-center w-full pt-2">
          <div>
            <p
              className={`font-semibold ${
                commissionStatus === '가능'
                  ? 'text-green-600 border border-green-600 text-center rounded-full px-2'
                  : commissionStatus === '대기 중'
                  ? 'text-yellow-600 border border-yellow-600 text-center rounded-full px-2'
                  : 'text-red-600 border border-red-600 text-center rounded-full px-2'
              }`}
            >
              커미션 {commissionStatus}
            </p>
            <p className="text-muted-foreground">
              ₩{priceStart.toLocaleString()}부터
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
          >
            <Heart className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
