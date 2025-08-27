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
import { Link, Form } from "react-router";
import { useState, useCallback } from "react";

interface ArtistCardProps {
  id: number;
  title: string;
  artistName: string;
  images: string[];
  rating: number;
  likes: number;
  tags: string[];
  commissionStatus: "가능" | "대기 중" | "불가";
  priceStart: number;
  isLiked?: boolean;
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
  commissionStatus,
  priceStart,
  isLiked = false,
  isLoggedIn = false,
}: ArtistCardProps) {
  // 좋아요 상태와 카운트를 로컬 state로 관리
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [isProcessing, setIsProcessing] = useState(false);

  // 좋아요 버튼 클릭 핸들러 - 디바운싱과 낙관적 UI 업데이트
  const handleLikeClick = useCallback((e: React.FormEvent) => {
    if (isProcessing) {
      e.preventDefault(); // 처리 중이면 요청 차단
      return;
    }
    
    setIsProcessing(true);
    setIsLikedState(!isLikedState); // 낙관적 업데이트
    setLikesCount((prev) => (isLikedState ? prev - 1 : prev + 1));
    
    // 최소 300ms 후에 다시 클릭 가능하도록
    setTimeout(() => setIsProcessing(false), 300);
  }, [isProcessing, isLikedState]);

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
          <span>❤️ {likesCount}</span>
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
                commissionStatus === "가능"
                  ? "text-green-600 border border-green-600 text-center rounded-full px-2"
                  : commissionStatus === "대기 중"
                  ? "text-yellow-600 border border-yellow-600 text-center rounded-full px-2"
                  : "text-red-600 border border-red-600 text-center rounded-full px-2"
              }`}
            >
              커미션 {commissionStatus}
            </p>
            <p className="text-muted-foreground">
              ₩{priceStart.toLocaleString()}부터
            </p>
          </div>

          {isLoggedIn ? (
            <Form method="post">
              <input type="hidden" name="action" value="like" />
              <input type="hidden" name="commissionId" value={id} />
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                onClick={handleLikeClick}
                disabled={isProcessing}
                className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLikedState ? "text-red-500 fill-current" : "text-red-500"
                  }`}
                />
              </Button>
            </Form>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
