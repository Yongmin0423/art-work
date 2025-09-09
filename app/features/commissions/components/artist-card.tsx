import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Heart } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import { useDebouncedFetcher } from "~/hooks/use-debounced-fetcher";
import { useState } from "react";

interface ArtistCardProps {
  id: number;
  title: string;
  artistName: string;
  images: string[];
  rating: number;
  likes: number;
  tags: string[];
  priceStart: number;
  isLiked: boolean;
  isLoggedIn?: boolean;
}

export default function ArtistCard({
  id,
  title,
  artistName,
  images,
  rating,
  likes,
  tags,
  priceStart,
  isLiked,
  isLoggedIn = false,
}: ArtistCardProps) {
  const fetcher = useDebouncedFetcher(300);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
  const [optimisticLikes, setOptimisticLikes] = useState(likes);

  const handleLikeClick = () => {
    const newIsLiked = !optimisticIsLiked;
    const newLikes = newIsLiked ? optimisticLikes + 1 : optimisticLikes - 1;
    
    setOptimisticIsLiked(newIsLiked);
    setOptimisticLikes(newLikes);
    
    fetcher.debouncedSubmit(
      { commissionId: id.toString() },
      {
        method: "post",
        action: `/commissions/${id}/like`,
      }
    );
  };


  return (
    <Card className="w-full max-w-md shadow-xl">
      <Link to={`/commissions/artist/${id}`} className="cursor-pointer">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{artistName}</CardDescription>
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
          <span>❤️ {optimisticLikes}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <Badge key={idx}>#{tag}</Badge>
          ))}
        </div>

        <div className="flex justify-between items-center w-full pt-2">
          <div>
            <p className="text-muted-foreground">
              ₩{priceStart.toLocaleString()}부터
            </p>
          </div>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLikeClick}
              disabled={false}
            >
              <Heart
                className={`w-5 h-5 ${
                  optimisticIsLiked ? "text-red-500 fill-current" : "text-red-500"
                }`}
              />
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
