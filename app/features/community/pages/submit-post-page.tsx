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
        title="Create Discussion"
        subtitle="Ask questions, share ideas, and connect with other developers"
      />
      <Form
        className="flex flex-col gap-10 max-w-screen-md mx-auto"
        method="post"
      >
        <InputPair
          label="Title"
          name="title"
          id="title"
          description="(40 characters or less)"
          required
          placeholder="i.e What is the best productivity tool?"
        />
        {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.title?.join("")}
          </div>
        )}
        <SelectPair
          required
          name="category"
          label="Category"
          description="Select the category that best fits your discussion"
          placeholder="i.e Productivity"
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
          label="Content"
          name="content"
          id="content"
          description="(1000 characters or less)"
          required
          placeholder="i.e I'm looking for a tool that can help me manage my time and tasks. What are the best tools out there?"
          textArea
        />
        {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.content?.join("")}
          </div>
        )}
        <Button className="mx-auto">Create Discussion</Button>
      </Form>
    </div>
  );
}
