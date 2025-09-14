import { z } from "zod";
import type { Route } from "./+types/social-complete-page";
import { redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Social Complete" }];
};

const paramsSchema = z.object({
  provider: z.enum(["kakao"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  console.log("=== Social Complete Start ===");
  
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    console.log("Social complete - invalid params");
    return redirect("/auth/login");
  }
  
  const { provider } = data;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  
  console.log("Social complete - provider:", provider);
  console.log("Social complete - code:", code ? "exists" : "missing");
  
  if (!code) {
    console.log("Social complete - no code, redirecting to login");
    return redirect("/auth/login");
  }
  
  const { client, headers } = makeSSRClient(request);
  
  console.log("Social complete - exchanging code for session...");
  const { data: sessionData, error } = await client.auth.exchangeCodeForSession(code);
  
  console.log("Social complete - session result:", { 
    user_id: sessionData?.user?.id, 
    session_exists: !!sessionData?.session,
    error: error?.message 
  });
  
  if (error) {
    console.error("Social complete - error:", error);
    throw error;
  }

  console.log("Social complete - redirecting with headers");
  return redirect("/", { headers });
};
