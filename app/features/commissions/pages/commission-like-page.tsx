import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/commission-like-page";
import { getLoggedInUser } from "../queries";
import { toggleCommissionLike } from "../mutations";

export const action = async ({ request, params }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method Not Allowed", { status: 405 });
  }
  
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  await toggleCommissionLike(client, {
    commissionId: Number(params.commissionId),
    userId: user.profile_id,
  });

  return { ok: true };
};