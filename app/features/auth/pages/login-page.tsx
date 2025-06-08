import { Form, Link, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/login-page";
import InputPair from "~/components/input-pair";
import { Button } from "~/components/ui/button";
import AuthButtons from "../components/auth-buttons";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { LoaderCircle } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Login" }];
};

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string",
    })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      loginError: null,
      formError: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      formError: null,
      loginError: loginError.message,
    };
  }
  return redirect("/", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="flex flex-col gap-4 items-center justify-center relative h-full">
      <Button
        variant="ghost"
        asChild
        className="absolute -top-18 -right-18 text-xs p-2"
      >
        <Link to="/auth/join">회원가입</Link>
      </Button>
      <div className="mb-5">
        <h2 className="text-3xl font-bold">Welcome to Artwork</h2>
        <h1 className="text-sm text-muted-foreground">
          Log in to your account
        </h1>
      </div>
      <Form className="w-full space-y-5">
        <InputPair
          label="Email"
          description="이메일을 입력해주세요."
          type="email"
          name="email"
          required
          id="email"
          placeholder="i.e artwork@gmail.com"
        />
        {actionData && "formError" in actionData && (
          <p className="text-red-500">{actionData.formError?.email}</p>
        )}
        <InputPair
          label="Password"
          description="비밀번호를 입력해주세요."
          type="password"
          name="password"
          required
          placeholder="8글자 이상 입력해주세요."
        />
        {actionData && "loginError" in actionData && (
          <p className="text-red-500">{actionData.loginError}</p>
        )}
        <Button type="submit" className="w-full">
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Log in"}
        </Button>
        {actionData && "formError" in actionData && (
          <p className="text-red-500">{actionData.loginError}</p>
        )}
      </Form>
      <AuthButtons />
    </div>
  );
}
