import { Card, CardHeader, CardFooter, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { useDebouncedFetcher } from "~/hooks/use-debounced-fetcher";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { ChevronUpIcon } from "lucide-react";
import { DateTime } from "luxon";

interface PostCardProps {
  postId: string;
  title: string;
  author: string;
  category: string;
  authorAvatarUrl: string | null;
  timeAgo: string;
  expanded?: boolean;
  votesCount?: number;
  isUpvoted?: boolean;
}

export function PostCard({
  postId,
  title,
  author,
  category,
  authorAvatarUrl = "https:github.com/apple.png",
  timeAgo,
  expanded = false,
  votesCount = 0,
  isUpvoted = false,
}: PostCardProps) {
  const fetcher = useDebouncedFetcher(300);
  const [optimisticVotesCount, setOptimisticVotesCount] = useState(votesCount);
  const [optimisticIsUpvoted, setOptimisticIsUpvoted] = useState(isUpvoted);
  
  const absorbClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newIsUpvoted = !optimisticIsUpvoted;
    const newVotesCount = newIsUpvoted ? optimisticVotesCount + 1 : optimisticVotesCount - 1;
    
    setOptimisticIsUpvoted(newIsUpvoted);
    setOptimisticVotesCount(newVotesCount);
    
    fetcher.debouncedSubmit(null, {
      method: "post",
      action: `/community/${postId}/upvote`,
    });
  };
  return (
    <Link to={`/community/${postId}`} className="block">
      <Card
        className={cn(
          "bg-transparent hover:bg-card/50 transition-colors",
          expanded ? "flex flex-row items-center justify-between" : ""
        )}
      >
        <CardHeader className="flex flex-row items-center gap-2 w-full">
          <Avatar className="size-12">
            <AvatarFallback>{author[0]}</AvatarFallback>
            {authorAvatarUrl && <AvatarImage src={authorAvatarUrl} />}
          </Avatar>
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            <div className="flex flex-row text-sm leading-tight gap-2">
              <span>{author}</span>
              <span>{category}</span>
              <span>•</span>
              <span>
                {(() => {
                  const postTime = DateTime.fromISO(timeAgo, { zone: "utc" });
                  const now = DateTime.now();
                  const diff = now.diff(postTime);

                  if (diff.as("minutes") < 60) {
                    return postTime.toRelative({ unit: "minutes" });
                  } else if (diff.as("hours") < 24) {
                    return postTime.toRelative({ unit: "hours" });
                  } else if (diff.as("days") < 30) {
                    return postTime.toRelative({ unit: "days" });
                  } else if (diff.as("months") < 12) {
                    return postTime.toRelative({ unit: "months" });
                  } else {
                    return postTime.toRelative({ unit: "years" });
                  }
                })()}
              </span>
            </div>
          </div>
        </CardHeader>
        {!expanded && (
          <CardFooter className="flex justify-end">
            <Button variant="link">Reply &rarr;</Button>
          </CardFooter>
        )}
        {expanded && (
          <CardFooter className="flex justify-end  pb-0">
            <Button
              onClick={absorbClick}
              variant="outline"
              className={cn(
                "flex flex-col h-14 cursor-pointer",
                optimisticIsUpvoted ? "bg-primary text-white" : ""
              )}
            >
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{optimisticVotesCount}</span>
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
