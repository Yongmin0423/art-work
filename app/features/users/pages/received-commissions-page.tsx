import { getLoggedInUser } from "~/features/community/queries";
import type { Route } from "./+types/received-commissions-page";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "받은 커미션 주문 - Artwork" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }
};

export default function ReceivedCommissionsPage({
  loaderData,
}: Route.ComponentProps) {
  console.log("loaderData", loaderData);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">받은 커미션 주문</h1>
      <p className="mt-4 text-muted-foreground">
        여기에 주문 테이블이 들어갈 예정입니다.
      </p>
    </div>
  );
}
