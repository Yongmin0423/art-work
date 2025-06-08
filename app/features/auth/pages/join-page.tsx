import { Button } from "~/components/ui/button";
import type { Route } from "./+types/join-page";
import { Form, Link, redirect, useNavigation } from "react-router";
import InputPair from "~/components/input-pair";
import AuthButtons from "../components/auth-buttons";
import { z } from "zod";
import { checkUsernameExist } from "../quries";
import { makeSSRClient } from "~/supa-client";
import { LoaderCircle } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Join" }];
};

const formSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3),
    username: z.string().min(3),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm_password"],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      formError: error.flatten().fieldErrors,
    };
  }
  const usernameExists = await checkUsernameExist(request, {
    username: data.username,
  });
  if (usernameExists) {
    return {
      formError: {
        username: ["이미 존재하는 닉네임입니다."],
      },
    };
  }
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        username: data.username,
      },
    },
  });
  if (signUpError) {
    console.error("Sign up error:", signUpError);

    // 구체적인 에러 메시지 제공
    let errorMessage = signUpError.message;

    if (signUpError.message.includes("Database error")) {
      errorMessage =
        "계정 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } else if (signUpError.message.includes("User already registered")) {
      errorMessage = "이미 가입된 이메일입니다.";
    } else if (signUpError.message.includes("Invalid email")) {
      errorMessage = "유효하지 않은 이메일 주소입니다.";
    }

    return {
      signUpError: errorMessage,
    };
  }
  return redirect("/", { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
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
        <Link to="/auth/login">로그인</Link>
      </Button>
      <div className="mb-5">
        <h2 className="text-3xl font-bold">Welcome to Artwork</h2>
        <h1 className="text-sm text-muted-foreground">Create your account</h1>
      </div>
      <Form className="w-full space-y-5" method="post">
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
          label="Username"
          description="닉네임을 입력해주세요."
          type="text"
          name="username"
          required
          id="username"
          placeholder="i.e artwork"
        />
        {actionData && "formError" in actionData && (
          <p className="text-red-500">{actionData.formError?.username}</p>
        )}
        <InputPair
          label="Name"
          description="이름을 입력해주세요."
          type="text"
          name="name"
          required
          id="name"
          placeholder="i.e Jane Doe"
        />
        {actionData && "formError" in actionData && (
          <p className="text-red-500">{actionData.formError?.name}</p>
        )}
        <InputPair
          label="Password"
          description="비밀번호를 입력해주세요."
          type="password"
          name="password"
          required
          placeholder="8글자 이상 입력해주세요."
        />
        {actionData && "formError" in actionData && (
          <p className="text-red-500">{actionData.formError?.password}</p>
        )}
        <InputPair
          id="confirm_password"
          label="Confirm Password"
          description="비밀번호를 다시 입력해주세요."
          name="confirm_password"
          required
          type="password"
          placeholder="8글자 이상 다시 입력해주세요."
        />
        {actionData && "formError" in actionData && (
          <p className="text-red-500">
            {actionData.formError?.confirm_password}
          </p>
        )}
        <Button type="submit" className="w-full">
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "회원가입"
          )}
        </Button>
        {actionData && "signUpError" in actionData && (
          <p className="text-red-500">{actionData.signUpError}</p>
        )}
      </Form>
      <AuthButtons />
    </div>
  );
}
