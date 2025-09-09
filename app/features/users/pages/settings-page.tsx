import { Form } from "react-router";
import InputPair from "~/components/input-pair";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import type { Route } from "./+types/settings-page";
import SelectPair from "~/components/select-pair";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";
import { getUserById } from "../queries";
import { z } from "zod";
import { updateUser, updateUserAvatar } from "../mutation";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Settings | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const user = await getUserById(client, { id: userId?.profile_id || "" });
  return { user };
};

const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  job_title: z.string().min(1),
  bio: z.string().optional(),
  work_status: z.string().min(1),
  location: z.string().optional(),
  website: z.string().optional(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUser(client);
  const formData = await request.formData();
  const avatar = formData.get("avatar");
  if (avatar && avatar instanceof File) {
    if (avatar.size <= 2 * 1024 * 1024 && avatar.type.startsWith("image/")) {
      const { data, error } = await client.storage
        .from("avatars")
        .upload(`${userId?.profile_id}/${Date.now()}`, avatar, {
          contentType: avatar.type,
          upsert: false,
        });
      if (error) {
        console.log(error);
        return { formErrors: { avatar: ["Failed to upload avatar"] } };
      }
      const {
        data: { publicUrl },
      } = await client.storage.from("avatars").getPublicUrl(data.path);
      await updateUserAvatar(client, {
        id: userId?.profile_id,
        avatarUrl: publicUrl,
      });
    }
  } else {
    const { success, data, error } = formSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!success) {
      return { formErrors: error.flatten().fieldErrors };
    }
    const { name, username, job_title, bio, work_status, location, website } =
      data;
    const user = await updateUser(client, {
      id: userId?.profile_id,
      name,
      username,
      job_title,
      bio,
      work_status,
      location,
      website,
    });
    return {
      ok: true,
    };
  }
};

export default function SettingsPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [avatar, setAvatar] = useState<string | null>(
    loaderData.user?.avatar_url || null
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-40">
        <div className="col-span-4 flex flex-col gap-10">
          {actionData?.ok ? (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your profile has been updated.
              </AlertDescription>
            </Alert>
          ) : null}
          <h2 className="text-2xl font-semibold">Edit profile</h2>
          <Form className="flex flex-col w-full max-w-lg gap-5" method="post">
            <InputPair
              label="Name"
              description="Your display name (shown on your profile)"
              required
              id="name"
              name="name"
              placeholder="John Doe"
              defaultValue={loaderData.user?.name}
            />
            {actionData?.formErrors && "name" in actionData?.formErrors ? (
              <Alert>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors?.name?.join(", ")}
                </AlertDescription>
              </Alert>
            ) : null}
            <InputPair
              label="Username"
              description="Your unique username (used in profile URL)"
              required
              id="username"
              name="username"
              placeholder="john_doe"
              defaultValue={loaderData.user?.username}
            />
            {actionData?.formErrors && "username" in actionData?.formErrors ? (
              <Alert>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors?.username?.join(", ")}
                </AlertDescription>
              </Alert>
            ) : null}
            <InputPair
              label="Job Title"
              description="Your professional title or specialty"
              id="job_title"
              name="job_title"
              placeholder="Product Designer"
              defaultValue={loaderData.user?.job_title || ""}
            />
            {actionData?.formErrors && "job_title" in actionData?.formErrors ? (
              <Alert>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors?.job_title?.join(", ")}
                </AlertDescription>
              </Alert>
            ) : null}
            <InputPair
              label="Bio"
              description="Tell others about yourself"
              id="bio"
              name="bio"
              placeholder="Passionate about creating beautiful and functional designs..."
              textArea
              defaultValue={loaderData.user?.bio ?? ""}
            />
            {actionData?.formErrors && "bio" in actionData?.formErrors ? (
              <Alert>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {actionData.formErrors?.bio}
                </AlertDescription>
              </Alert>
            ) : null}
            <SelectPair
              label="Work Status"
              description="Your current availability for work"
              name="work_status"
              placeholder="Select your status"
              defaultValue={loaderData.user?.work_status ?? "available"}
              options={[
                { label: "Available for work", value: "available" },
                { label: "Busy", value: "busy" },
                { label: "Not available", value: "unavailable" },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputPair
                label="Location"
                description="Where you're based"
                id="location"
                name="location"
                placeholder="Seoul, South Korea"
                defaultValue={loaderData.user?.location ?? ""}
              />
              {actionData?.formErrors &&
              "location" in actionData?.formErrors ? (
                <Alert>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors?.location?.join(", ")}
                  </AlertDescription>
                </Alert>
              ) : null}
              <InputPair
                label="Website"
                description="Your personal website or portfolio"
                id="website"
                name="website"
                type="url"
                placeholder="https://johndoe.com"
                defaultValue={loaderData.user?.website ?? ""}
              />
              {actionData?.formErrors && "website" in actionData?.formErrors ? (
                <Alert>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors?.website}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
            <Button type="submit" className="w-full">
              Update profile
            </Button>
          </Form>
        </div>

        <Form
          method="post"
          className="col-span-2 p-6 rounded-lg border shadow-md h-fit"
          encType="multipart/form-data"
        >
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Avatar</Label>
              <p className="text-xs text-muted-foreground mt-1">
                This is your public avatar.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <Avatar className="size-32">
                {(avatar || loaderData.user?.avatar_url) && (
                  <AvatarImage
                    src={avatar || loaderData.user?.avatar_url || ""}
                    alt="Avatar preview"
                  />
                )}
                <AvatarFallback>{loaderData.user?.name[0]}</AvatarFallback>
              </Avatar>

              <Input
                type="file"
                className="w-full"
                onChange={onChange}
                accept="image/png,image/jpeg,image/jpg"
                name="avatar"
              />
              {actionData?.formErrors && "avatar" in actionData?.formErrors ? (
                <Alert>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors?.avatar?.join(", ")}
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="text-xs text-muted-foreground space-y-1 text-center">
                <p>Recommended: 400x400px</p>
                <p>Formats: PNG, JPEG, JPG</p>
                <p>Max size: 2MB</p>
              </div>

              <Button type="submit" className="w-full" size="sm">
                Update avatar
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
