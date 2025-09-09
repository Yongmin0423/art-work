import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/post-upvote-page";
import { getLoggedInUser } from "../queries";
import { toggleUpvote } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  await toggleUpvote(client, {
    postId: params.postId,
    userId: userId.profile_id,
  });
  return {
    ok: true,
  };
};
