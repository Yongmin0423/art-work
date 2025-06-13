import { makeSSRClient } from "~/supa-client";

export const checkUsernameExist = async (
  request: Request,
  { username }: { username: string }
) => {
  const { client } = makeSSRClient(request);
  const { error } = await client
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();

  console.log("[checkUsernameExist] error:", error);

  if (error) {
    return false;
  }
  return true;
};
