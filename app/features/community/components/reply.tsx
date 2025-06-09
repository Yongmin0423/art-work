import { Form, Link, useActionData, useOutletContext } from "react-router";
import { DotIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useEffect, useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { action } from "../pages/post-page";

interface ReplyProps {
  name: string;
  username: string;
  avatarUrl: string | null;
  content: string;
  timestamp: string;
  topLevel: boolean;
  topLevelId: number;
  replies?: {
    post_reply_id: number;
    reply: string;
    created_at: string;
    user: {
      name: string;
      avatar_url: string | null;
      username: string;
    };
  }[];
}

export function Reply({
  name,
  username,
  avatarUrl,
  content,
  timestamp,
  topLevel,
  topLevelId,
  replies,
}: ReplyProps) {
  const actionData = useActionData<typeof action>();
  const [replying, setReplying] = useState(false);
  const toggleReplying = () => setReplying((prev) => !prev);
  const {
    isLoggedIn,
    name: loggedInName,
    avatar,
  } = useOutletContext<{
    isLoggedIn: boolean;
    name: string;
    avatar: string;
  }>();
  useEffect(() => {
    if (actionData?.ok) {
      setReplying(false);
    }
  }, [actionData]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-5 w-2/3">
        <Avatar className="size-14">
          <AvatarFallback>{name[0]}</AvatarFallback>
          {avatarUrl && <AvatarImage src={avatarUrl} />}
        </Avatar>
        <div className="flex flex-col gap-2 items-start">
          <div className="flex gap-2 items-center">
            <Link to={`/users/@${name}`}>
              <h4 className="font-medium">{name}</h4>
            </Link>
            <DotIcon className="size-5" />
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          </div>
          <p className="text-muted-foreground">{content}</p>
          {isLoggedIn && (
            <Button
              variant="ghost"
              className="self-end"
              onClick={toggleReplying}
            >
              <MessageCircleIcon className="size-4" />
              Reply
            </Button>
          )}
        </div>
      </div>
      {replying && (
        <Form className="flex items-start gap-5 w-3/4" method="post">
          <Avatar className="size-14">
            <AvatarFallback>{loggedInName[0]}</AvatarFallback>
            <AvatarImage src={avatar} />
          </Avatar>
          <div className="flex flex-col gap-5 items-end w-full">
            <Textarea
              autoFocus
              name="reply"
              placeholder="Write a reply"
              className="w-full resize-none"
              defaultValue={`@${username} `}
              rows={5}
            />
            <Button>Reply</Button>
          </div>
        </Form>
      )}
      {topLevel && replies && (
        <div className="pl-20 w-full">
          {replies.map((reply) => (
            <Reply
              name={reply.user.name}
              username={reply.user.username}
              avatarUrl={reply.user.avatar_url}
              content={reply.reply}
              timestamp={reply.created_at}
              topLevel={false}
              topLevelId={topLevelId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
