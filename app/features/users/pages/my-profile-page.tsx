import { redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { getUserById } from "../queries";
import type { Route } from "./+types/my-profile-page";

export async function loader({ request }: Route.LoaderArgs) {
  const { client } = makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (user) {
    const profile = await getUserById(client, { id: user.id });
    return redirect(`/users/${profile?.username}`);
  }
  return redirect("/auth/login");
}
