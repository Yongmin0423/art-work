import { Form, redirect } from "react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { XIcon, PlusIcon, ImageIcon } from "lucide-react";
import { makeSSRClient } from "~/supa-client";
import { createPortfolio } from "../queries";
import InputPair from "~/components/input-pair";
import SelectPair from "~/components/select-pair";
import { COMMISSION_CATEGORIES } from "~/features/commissions/constants";
import type { Route } from "./+types/portfolio-create-page";
import { getLoggedInUser } from "~/features/community/queries";
import { z } from "zod";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return { user };
};

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUser(client);

  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { error: error.flatten().fieldErrors };
  }

  const { title, description, category, tags: tagsString } = data;

  // 태그 파싱
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  // 이미지 처리 (임시로 빈 배열, 실제로는 파일 업로드 처리 필요)
  const images: string[] = [];

  try {
    await createPortfolio(client, {
      artist_id: userId,
      title,
      description: description || undefined,
      images,
      category: category || undefined,
      tags,
    });

    return redirect("/my/profile");
  } catch (error) {
    return {
      error: "Failed to create portfolio. Please try again.",
    };
  }
};

export const meta: Route.MetaFunction = () => {
  return [{ title: "Create Portfolio | wemake" }];
};

export default function PortfolioCreatePage({
  actionData,
}: Route.ComponentProps) {
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const addImageSlot = () => {
    setImages([...images, ""]);
  };

  const removeImageSlot = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Portfolio</h1>
        <p className="text-muted-foreground">
          Showcase your best work and attract potential clients
        </p>
      </div>

      <Form method="post" className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <InputPair
            label="Project Title"
            description="Give your project a catchy title"
            required
            id="title"
            name="title"
            placeholder="Amazing Character Design"
          />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <p className="text-sm text-muted-foreground">
              Describe your project, process, and inspiration
            </p>
            <Textarea
              id="description"
              name="description"
              placeholder="This project was inspired by..."
              className="resize-none"
              rows={4}
            />
          </div>

          <SelectPair
            label="Category"
            description="Choose the category that best fits your work"
            name="category"
            placeholder="Select a category"
            options={[...COMMISSION_CATEGORIES]}
          />
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div>
            <Label>Tags</Label>
            <p className="text-sm text-muted-foreground">
              Add tags to help people discover your work
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={addTag} variant="outline">
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Hidden input for form submission */}
          <input type="hidden" name="tags" value={tags.join(",")} />
        </div>

        {/* Images */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Portfolio Images</h3>
              <p className="text-sm text-muted-foreground">
                Upload high-quality images of your work
              </p>
            </div>
            <Button type="button" onClick={addImageSlot} variant="outline">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({
              length: Math.max(3, images.length + 1),
            }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative group">
                  {images[index] ? (
                    <>
                      <img
                        src={images[index]}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImageSlot(index)}
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm">Image {index + 1}</span>
                    </div>
                  )}
                </div>
                <Input
                  type="file"
                  name={`image_${index}`}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, index)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Upload high-quality examples of your work</p>
            <p>• Recommended: 1200x1200px or larger</p>
            <p>• Formats: PNG, JPEG, WebP</p>
            <p>• Max file size: 5MB per image</p>
          </div>
        </div>

        {(actionData as any)?.error && (
          <div className="text-red-500 text-center p-4 border border-red-200 rounded-lg">
            {(actionData as any).error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" className="flex-1">
            Create Portfolio
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/my/profile">Cancel</a>
          </Button>
        </div>
      </Form>
    </div>
  );
}
