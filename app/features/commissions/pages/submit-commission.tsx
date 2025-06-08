import { Form, redirect } from "react-router";
import type { Route } from "./+types/submit-commission";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import SelectPair from "~/components/select-pair";
import InputPair from "~/components/input-pair";
import { useState } from "react";
import { Hero } from "~/components/hero";
import { COMMISSION_CATEGORIES } from "../constants";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";
import { z } from "zod";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Submit Commission | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  await getLoggedInUser(client); // 로그인 확인
  return {};
};

const formSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  category: z.string().min(1),
  price_start: z.coerce.number().min(1000),
  turnaround_days: z.coerce.number().min(1).max(365),
  revision_count: z.coerce.number().min(0).max(10),
  base_size: z.string().min(1),
  tags: z.string().optional(),
});

type PriceChoice = {
  label: string;
  price: number;
  description?: string;
};

type PriceOption = {
  type: string;
  choices: PriceChoice[];
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedInUser(client);

  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  // 가격 옵션들 파싱 (formData에서 동적으로 수집)
  const priceOptions: PriceOption[] = [];
  const optionIndices = new Set<string>();

  // 먼저 모든 옵션 인덱스 수집
  for (const [key] of formData.entries()) {
    if (key.startsWith("price_type_")) {
      const index = key.split("_")[2];
      optionIndices.add(index);
    }
  }

  // 각 옵션별로 데이터 수집
  for (const index of optionIndices) {
    const type = formData.get(`price_type_${index}`) as string;
    if (!type) continue;

    const choices: PriceChoice[] = [];
    let choiceIndex = 0;

    // 해당 옵션의 모든 선택지 수집
    while (formData.has(`choice_label_${index}_${choiceIndex}`)) {
      const label = formData.get(
        `choice_label_${index}_${choiceIndex}`
      ) as string;
      const price = parseInt(
        formData.get(`choice_price_${index}_${choiceIndex}`) as string
      );
      const description = formData.get(
        `choice_desc_${index}_${choiceIndex}`
      ) as string;

      if (label && price) {
        choices.push({ label, price, description: description || undefined });
      }
      choiceIndex++;
    }

    if (choices.length > 0) {
      priceOptions.push({ type, choices });
    }
  }

  // 태그 처리
  const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [];

  // 이미지 처리 (여러 파일)
  const images: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("image_") && value instanceof File && value.size > 0) {
      // 실제로는 파일 업로드 로직이 필요하지만, 여기서는 placeholder URL 사용
      images.push(
        `https://via.placeholder.com/600x400?text=Portfolio+${
          images.length + 1
        }`
      );
    }
  }

  try {
    const { error: insertError } = await client.from("commission").insert({
      artist_id: userId,
      title: data.title,
      description: data.description,
      category: data.category as any,
      tags: tags,
      price_start: data.price_start,
      price_options: priceOptions,
      turnaround_days: data.turnaround_days,
      revision_count: data.revision_count,
      base_size: data.base_size,
      status: "available",
    });

    if (insertError) {
      throw insertError;
    }

    return redirect("/commissions");
  } catch (err) {
    return {
      error: "Failed to create commission. Please try again.",
    };
  }
};

export default function SubmitCommissionPage({
  actionData,
}: Route.ComponentProps) {
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([
    { type: "", choices: [{ label: "", price: 0, description: "" }] },
  ]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newImages = [...portfolioImages];
      newImages[index] = URL.createObjectURL(file);
      setPortfolioImages(newImages);
    }
  };

  const addPriceOption = () => {
    setPriceOptions([
      ...priceOptions,
      { type: "", choices: [{ label: "", price: 0, description: "" }] },
    ]);
  };

  const removePriceOption = (index: number) => {
    if (priceOptions.length > 1) {
      setPriceOptions(priceOptions.filter((_, i) => i !== index));
    }
  };

  const updatePriceOptionType = (index: number, type: string) => {
    const newOptions = [...priceOptions];
    newOptions[index] = { ...newOptions[index], type };
    setPriceOptions(newOptions);
  };

  const addChoice = (optionIndex: number) => {
    const newOptions = [...priceOptions];
    newOptions[optionIndex].choices.push({
      label: "",
      price: 0,
      description: "",
    });
    setPriceOptions(newOptions);
  };

  const removeChoice = (optionIndex: number, choiceIndex: number) => {
    const newOptions = [...priceOptions];
    if (newOptions[optionIndex].choices.length > 1) {
      newOptions[optionIndex].choices.splice(choiceIndex, 1);
      setPriceOptions(newOptions);
    }
  };

  const updateChoice = (
    optionIndex: number,
    choiceIndex: number,
    field: keyof PriceChoice,
    value: string | number
  ) => {
    const newOptions = [...priceOptions];
    newOptions[optionIndex].choices[choiceIndex] = {
      ...newOptions[optionIndex].choices[choiceIndex],
      [field]: value,
    };
    setPriceOptions(newOptions);
  };

  const addImageSlot = () => {
    setPortfolioImages([...portfolioImages, ""]);
  };

  return (
    <div className="space-y-20">
      <Hero
        title="Submit Commission"
        subtitle="Share your artistic services with the community"
      />

      <Form
        className="max-w-screen-lg mx-auto space-y-10"
        method="post"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-2 gap-20">
          {/* 왼쪽 컬럼 - 기본 정보 */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Basic Information</h3>

            <InputPair
              label="Commission Title"
              description="What kind of artwork do you create?"
              id="title"
              name="title"
              required
              placeholder="e.g., Anime Character Illustration"
            />
            {actionData?.fieldErrors?.title && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.title.join(", ")}
              </div>
            )}

            <InputPair
              label="Description"
              description="Detailed description of your commission service"
              id="description"
              name="description"
              textArea
              required
              placeholder="Describe your art style, what you offer, and any special techniques..."
            />
            {actionData?.fieldErrors?.description && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.description.join(", ")}
              </div>
            )}

            <SelectPair
              label="Category"
              description="Select the main category for your commission"
              name="category"
              required
              placeholder="Choose a category"
              options={COMMISSION_CATEGORIES.map((cat) => ({
                label: cat.label,
                value: cat.value,
              }))}
            />
            {actionData?.fieldErrors?.category && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.category.join(", ")}
              </div>
            )}

            <InputPair
              label="Tags"
              description="Comma-separated tags (e.g., anime, portrait, digital)"
              id="tags"
              name="tags"
              placeholder="anime, portrait, digital, fantasy"
            />
          </div>

          {/* 오른쪽 컬럼 - 가격 및 조건 */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Pricing & Terms</h3>

            <InputPair
              label="Starting Price"
              description="Your lowest price (KRW)"
              id="price_start"
              name="price_start"
              type="number"
              required
              placeholder="50000"
            />
            {actionData?.fieldErrors?.price_start && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.price_start.join(", ")}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <InputPair
                label="Turnaround Days"
                description="How many days to complete"
                id="turnaround_days"
                name="turnaround_days"
                type="number"
                required
                placeholder="7"
              />
              <InputPair
                label="Free Revisions"
                description="Number of free revisions"
                id="revision_count"
                name="revision_count"
                type="number"
                required
                placeholder="3"
              />
            </div>

            <InputPair
              label="Base Canvas Size"
              description="Default image dimensions"
              id="base_size"
              name="base_size"
              required
              placeholder="3000x3000px"
            />
            {actionData?.fieldErrors?.base_size && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.base_size.join(", ")}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* 가격 옵션 섹션 */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Price Options</h3>
            <Button type="button" onClick={addPriceOption} variant="outline">
              Add Option Category
            </Button>
          </div>

          <div className="space-y-6">
            {priceOptions.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="p-6 border-2 rounded-lg space-y-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <Badge variant="default" className="text-lg">
                    Option Category {optionIndex + 1}
                  </Badge>
                  {priceOptions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePriceOption(optionIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove Category
                    </Button>
                  )}
                </div>

                {/* 옵션 타입 */}
                <div>
                  <Label htmlFor={`price_type_${optionIndex}`}>
                    Option Type
                  </Label>
                  <Input
                    id={`price_type_${optionIndex}`}
                    name={`price_type_${optionIndex}`}
                    placeholder="e.g., Character Type, Background Style, etc."
                    value={option.type}
                    onChange={(e) =>
                      updatePriceOptionType(optionIndex, e.target.value)
                    }
                    required
                    className="mb-4"
                  />
                </div>

                {/* 선택지들 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">
                      Available Choices
                    </Label>
                    <Button
                      type="button"
                      onClick={() => addChoice(optionIndex)}
                      variant="outline"
                      size="sm"
                    >
                      Add Choice
                    </Button>
                  </div>

                  {option.choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className="p-3 bg-white rounded border space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Choice {choiceIndex + 1}
                        </span>
                        {option.choices.length > 1 && (
                          <Button
                            type="button"
                            onClick={() =>
                              removeChoice(optionIndex, choiceIndex)
                            }
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label
                            htmlFor={`choice_label_${optionIndex}_${choiceIndex}`}
                            className="text-xs"
                          >
                            Choice Name
                          </Label>
                          <Input
                            id={`choice_label_${optionIndex}_${choiceIndex}`}
                            name={`choice_label_${optionIndex}_${choiceIndex}`}
                            placeholder="e.g., Basic, Premium"
                            value={choice.label}
                            onChange={(e) =>
                              updateChoice(
                                optionIndex,
                                choiceIndex,
                                "label",
                                e.target.value
                              )
                            }
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`choice_price_${optionIndex}_${choiceIndex}`}
                            className="text-xs"
                          >
                            Price (KRW)
                          </Label>
                          <Input
                            id={`choice_price_${optionIndex}_${choiceIndex}`}
                            name={`choice_price_${optionIndex}_${choiceIndex}`}
                            type="number"
                            placeholder="50000"
                            value={choice.price || ""}
                            onChange={(e) =>
                              updateChoice(
                                optionIndex,
                                choiceIndex,
                                "price",
                                parseInt(e.target.value) || 0
                              )
                            }
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`choice_desc_${optionIndex}_${choiceIndex}`}
                            className="text-xs"
                          >
                            Description
                          </Label>
                          <Input
                            id={`choice_desc_${optionIndex}_${choiceIndex}`}
                            name={`choice_desc_${optionIndex}_${choiceIndex}`}
                            placeholder="What's included"
                            value={choice.description || ""}
                            onChange={(e) =>
                              updateChoice(
                                optionIndex,
                                choiceIndex,
                                "description",
                                e.target.value
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <p>
              <strong>Example:</strong>
            </p>
            <p>
              • <strong>Option Type:</strong> "Character Type"
            </p>
            <p>
              • <strong>Choices:</strong> "Basic - 50,000원", "Full Body -
              100,000원", "Detailed - 150,000원"
            </p>
            <p>
              • <strong>Result:</strong> Customers can select one choice from
              each option category
            </p>
          </div>
        </div>

        <Separator />

        {/* 포트폴리오 이미지 섹션 */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Portfolio Images</h3>
            <Button type="button" onClick={addImageSlot} variant="outline">
              Add Image Slot
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {Array.from({
              length: Math.max(3, portfolioImages.length + 1),
            }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  {portfolioImages[index] ? (
                    <img
                      src={portfolioImages[index]}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>Image {index + 1}</span>
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

          <div className="text-sm text-gray-600">
            <p>• Upload high-quality examples of your work</p>
            <p>• Recommended: 1200x1200px or larger</p>
            <p>• Formats: PNG, JPEG, WebP</p>
            <p>• Max file size: 5MB per image</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="text-red-500 text-center p-4 border border-red-200 rounded-lg">
            {actionData.error}
          </div>
        )}

        <div className="flex justify-center pt-6">
          <Button type="submit" size="lg" className="px-16">
            Submit Commission
          </Button>
        </div>
      </Form>
    </div>
  );
}
