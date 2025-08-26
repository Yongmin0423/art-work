import { Hero } from "~/components/hero";
import { Form, redirect } from "react-router";
import InputPair from "~/components/input-pair";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/submit-post-page";
import SelectPair from "~/components/select-pair";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser, getTopics } from "../queries";
import { z } from "zod";
import { createPost } from "../mutations";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Submit Post | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  await getLoggedInUser(client);
  const topics = await getTopics(client);
  return { topics };
};

const formSchema = z.object({
  title: z.string().min(1).max(40),
  category: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const user = await getLoggedInUser(client);
  if (!user) {
    return redirect("/auth/login");
  }
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { title, category, content } = data;
  const { post_id } = await createPost(client, {
    title,
    category,
    content,
    userId: user.profile_id,
  });
  return redirect(`/community/${post_id}`);
};

export default function SubmitPostPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero
        title="새 글 작성하기"
        subtitle="다른 사람들과 소통하고, 받은 작품을 공유해보세요."
      />
      <Form
        className="flex flex-col gap-10 max-w-screen-md mx-auto"
        method="post"
      >
        <InputPair
          label="제목"
          name="title"
          id="title"
          description="(40자 이내)"
          required
          placeholder="이 작가님 어때요?"
        />
        {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.title?.join("")}
          </div>
        )}
        <SelectPair
          required
          name="category"
          label="카테고리"
          description="주제에 맞는 카테고리를 선택해주세요."
          placeholder="Illustration"
          options={loaderData.topics.map((topic) => ({
            label: topic.name,
            value: topic.slug,
          }))}
        />
        {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.category?.join("")}
          </div>
        )}
        <InputPair
          label="내용"
          name="content"
          id="content"
          description="(1000자 이내)"
          required
          placeholder="이 작가님 그림이 정말 마음에 들어서 커미션을 맡겨보려는데 어떨까요?"
          textArea
        />
        {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.content?.join("")}
          </div>
        )}
        <Button className="mx-auto">등록하기</Button>
      </Form>
    </div>
  );
}
