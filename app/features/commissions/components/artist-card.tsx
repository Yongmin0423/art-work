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
import { Link, Form, useActionData, useSubmit, useRevalidator } from "react-router";
import { useState, useEffect } from "react";

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
  const actionData = useActionData();
  const submit = useSubmit();
  const revalidator = useRevalidator();
  
  // 좋아요 상태와 카운트를 로컬 state로 관리 (데이터베이스 상태를 초기값으로 사용)
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const [isProcessing, setIsProcessing] = useState(false);

  // props가 변경되면 local state 업데이트 (페이지 새로고침 또는 데이터 리로드 시)
  useEffect(() => {
    console.log(`Commission ${id}: props 변경됨`, { 
      newIsLiked: isLiked, 
      newLikes: likes, 
      currentState: { isLikedState, likesCount } 
    });
    setIsLikedState(isLiked);
    setLikesCount(likes);
  }, [isLiked, likes, id, isLikedState, likesCount]);

  // 서버 응답 처리 - 좋아요 토글 완료 시 데이터 재검증
  useEffect(() => {
    if (actionData && (actionData.liked === true || actionData.liked === false)) {
      console.log("서버 응답 받음, 데이터 재검증 시작");
      revalidator.revalidate();
      setIsProcessing(false);
    }
    if (actionData?.error) {
      // 에러 발생 시 낙관적 업데이트 되돌리기
      setIsLikedState(isLiked);
      setLikesCount(likes);
      setIsProcessing(false);
    }
  }, [actionData, isLiked, likes, revalidator]);


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
            <p className="text-muted-foreground">
              ₩{priceStart.toLocaleString()}부터
            </p>
          </div>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log("좋아요 버튼 클릭됨", { isProcessing, isLikedState });
                
                if (isProcessing) {
                  console.log("처리 중이라서 요청 차단됨");
                  return;
                }
                
                console.log("낙관적 업데이트 시작");
                setIsProcessing(true);
                setIsLikedState(!isLikedState);
                setLikesCount((prev) => (isLikedState ? prev - 1 : prev + 1));
                
                console.log("useSubmit으로 Form 제출");
                submit(
                  {
                    action: "like",
                    commissionId: id.toString(),
                  },
                  { method: "post" }
                );
                
                setTimeout(() => {
                  console.log("처리 상태 해제됨");
                  setIsProcessing(false);
                }, 300);
              }}
              disabled={isProcessing}
              className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLikedState ? "text-red-500 fill-current" : "text-red-500"
                }`}
              />
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
