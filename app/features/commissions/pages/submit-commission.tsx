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
import {
  createCommission,
  createCommissionImage,
  updateCommission,
} from "../mutations";
import { getCommissionById } from "../queries";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";

export const meta: Route.MetaFunction = ({ params }) => {
  const isEdit = params.id;
  return [
    {
      title: isEdit ? "Edit Commission | wemake" : "Submit Commission | wemake",
    },
  ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const user = await getLoggedInUser(client); // 로그인 확인

  const isEdit = !!params.id;

  if (isEdit) {
    const commission = await getCommissionById(client, {
      commissionId: Number(params.id),
    });

    // 작성자 권한 확인
    if (commission.profile_id !== user.profile_id) {
      throw new Response("수정 권한이 없습니다.", { status: 403 });
    }

    return { commission, isEdit: true };
  }

  return { isEdit: false };
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

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client, headers } = makeSSRClient(request);
  const formData = await request.formData();

  const isEdit = !!params.id;

  // Form validation
  const result = formSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    price_start: formData.get("price_start"),
    turnaround_days: formData.get("turnaround_days"),
    revision_count: formData.get("revision_count"),
    base_size: formData.get("base_size"),
  });

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const data = result.data;
  const tags = formData.getAll("tags") as string[];
  const priceOptions = JSON.parse(formData.get("price_options") as string);

  const user = await getLoggedInUser(client);
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = user.profile_id;

  // 이미지 업로드
  const images: string[] = [];
  const imageFiles = Array.from({ length: 10 })
    .map((_, i) => formData.get(`image_${i}`) as File | null)
    .filter(Boolean);

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    if (
      file &&
      file.size <= 5 * 1024 * 1024 &&
      file.type.startsWith("image/")
    ) {
      const { data: uploadData, error } = await client.storage
        .from("commission-images")
        .upload(`${userId}/${Date.now()}-${i}`, file, {
          contentType: file.type,
          upsert: false,
        });
      if (error) {
        return { error: `Failed to upload image ${file.name}` };
      }
      const {
        data: { publicUrl },
      } = await client.storage
        .from("commission-images")
        .getPublicUrl(uploadData.path);
      images.push(publicUrl);
    }
  }

  if (isEdit) {
    // 수정 모드
    await updateCommission(client, {
      commissionId: Number(params.id),
      title: data.title,
      description: data.description,
      category: data.category as any,
      tags: tags,
      price_start: data.price_start,
      price_options: priceOptions,
      turnaround_days: data.turnaround_days,
      revision_count: data.revision_count,
      base_size: data.base_size,
    });

    return redirect(`/commissions/artist/${params.id}`);
  } else {
    // 생성 모드
    const commission = await createCommission(client, {
      profile_id: userId,
      title: data.title,
      description: data.description,
      category: data.category as any,
      tags: tags,
      price_start: data.price_start,
      price_options: priceOptions,
      turnaround_days: data.turnaround_days,
      revision_count: data.revision_count,
      base_size: data.base_size,
      images: images, // 이미지 URL 배열 전달
    });

    return redirect("/commissions/create/success");
  }
};

export default function SubmitCommissionPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { commission, isEdit } = loaderData;

  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>(
    isEdit &&
      commission?.price_options &&
      Array.isArray(commission.price_options)
      ? (commission.price_options as unknown as PriceOption[])
      : [{ type: "", choices: [{ label: "", price: 0, description: "" }] }]
  );

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
        title={isEdit ? "커미션 수정" : "커미션 등록"}
        subtitle={isEdit ? "커미션 수정하기" : "당신의 작품을 소개해주세요"}
      />

      <Form
        className="max-w-screen-lg mx-auto space-y-10 px-4 sm:px-6 lg:px-8"
        method="post"
        encType="multipart/form-data"
      >
        {/* Hidden input for price_options */}
        <input
          type="hidden"
          name="price_options"
          value={JSON.stringify(priceOptions)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {/* 왼쪽 컬럼 - 기본 정보 */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">기본 정보</h3>

            <InputPair
              label="제목"
              description="제목을 작성해주세요"
              id="title"
              name="title"
              required
              defaultValue={isEdit ? commission?.title : ""}
              placeholder="캐릭터 일러스트레이트 전문 / 00작가"
            />
            {actionData?.fieldErrors?.title && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.title.join(", ")}
              </div>
            )}

            <InputPair
              label="설명"
              description="설명을 작성해주세요"
              id="description"
              name="description"
              textArea
              required
              defaultValue={isEdit ? commission?.description : ""}
              placeholder="당신의 장점, 스타일 등 자유롭게 자신을 어필해주세요"
            />
            {actionData?.fieldErrors?.description && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.description.join(", ")}
              </div>
            )}

            <SelectPair
              label="카테고리"
              description="카테고리를 선택해주세요"
              name="category"
              required
              defaultValue={isEdit ? commission?.category : ""}
              placeholder="카테고리 선택"
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
              label="태그"
              description=",를 통해 태그를 넣어주세요"
              id="tags"
              name="tags"
              defaultValue={
                isEdit && Array.isArray(commission?.tags)
                  ? commission.tags.join(", ")
                  : ""
              }
              placeholder="일러스트, 애니메이션, 디지털"
            />
          </div>

          {/* 오른쪽 컬럼 - 가격 및 조건 */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">가격&조건</h3>

            <InputPair
              label="최소가"
              description="검색을 위한 최소가를 적어주세요 (KRW)"
              id="price_start"
              name="price_start"
              type="number"
              required
              defaultValue={isEdit ? commission?.price_start?.toString() : ""}
              placeholder="5,000"
            />
            {actionData?.fieldErrors?.price_start && (
              <div className="text-red-500 text-sm">
                {actionData.fieldErrors.price_start.join(", ")}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <InputPair
                  label="작업 기간(일)"
                  description="작업 소요 평균 시간 "
                  id="turnaround_days"
                  name="turnaround_days"
                  type="number"
                  required
                  defaultValue={
                    isEdit ? commission?.turnaround_days?.toString() : ""
                  }
                  placeholder="7"
                />
                {actionData?.fieldErrors?.turnaround_days && (
                  <div className="text-red-500 text-sm">
                    {actionData.fieldErrors.turnaround_days.join(", ")}
                  </div>
                )}
              </div>
              <div>
                <InputPair
                  label="수정기간"
                  description="작업 완료 후 수정기간"
                  id="revision_count"
                  name="revision_count"
                  type="number"
                  required
                  defaultValue={
                    isEdit ? commission?.revision_count?.toString() : ""
                  }
                  placeholder="3"
                />
                {actionData?.fieldErrors?.revision_count && (
                  <div className="text-red-500 text-sm">
                    {actionData.fieldErrors.revision_count.join(", ")}
                  </div>
                )}
              </div>
            </div>

            <InputPair
              label="기본 이미지 사이즈"
              description=""
              id="base_size"
              name="base_size"
              required
              defaultValue={isEdit ? commission?.base_size : ""}
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
            <h3 className="text-2xl font-bold">가격 옵션</h3>
            <Button type="button" onClick={addPriceOption} variant="outline">
              옵션 추가하기
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
                    작품 선택 옵션 {optionIndex + 1}
                  </Badge>
                  {priceOptions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePriceOption(optionIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      옵션 제거
                    </Button>
                  )}
                </div>

                {/* 옵션 타입 */}
                <div>
                  <Label htmlFor={`price_type_${optionIndex}`}>
                    작품 옵션 제목
                  </Label>
                  <Input
                    id={`price_type_${optionIndex}`}
                    name={`price_type_${optionIndex}`}
                    placeholder="예시) 캐릭터 일러스트"
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
                      선택 가능 옵션들
                    </Label>
                    <Button
                      type="button"
                      onClick={() => addChoice(optionIndex)}
                      variant="outline"
                      size="sm"
                    >
                      옵션 추가
                    </Button>
                  </div>

                  {option.choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className="p-3 bg-white rounded border space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          선택지 {choiceIndex + 1}
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
                            삭제
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label
                            htmlFor={`choice_label_${optionIndex}_${choiceIndex}`}
                            className="text-xs"
                          >
                            선택지 이름
                          </Label>
                          <Input
                            id={`choice_label_${optionIndex}_${choiceIndex}`}
                            name={`choice_label_${optionIndex}_${choiceIndex}`}
                            placeholder="예시) SD캐릭터, 상반신 일러스트 등"
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
                            가격 (KRW)
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
                            설명
                          </Label>
                          <Input
                            id={`choice_desc_${optionIndex}_${choiceIndex}`}
                            name={`choice_desc_${optionIndex}_${choiceIndex}`}
                            placeholder="선택지에 대한 설명을 작성해주세요"
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

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg space-y-1">
            <p>
              <strong>예시:</strong>
            </p>
            <p>
              • <strong>옵션 선택 제목:</strong> "캐릭터 일러스트"
            </p>
            <p>
              • <strong>선택지:</strong> "SD 캐릭터 - 5,000원", "상반신 -
              10,000원", "전신 - 5,0000원", "배경 포함 전신 - 10,000원"
            </p>
          </div>
        </div>

        <Separator />

        {/*  이미지 섹션 */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">작품 이미지</h3>
            <Button type="button" onClick={addImageSlot} variant="outline">
              이미지 슬롯 추가
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg space-y-1">
            <p>• 선택에 도움을 줄 수 있도록 자신의 작품을 업로드해주세요</p>
            <p>• 이미지 형식: PNG, JPEG, WebP</p>
            <p>• 이미지 최대 사이즈: 5MB per image</p>
          </div>
        </div>

        {actionData?.error && (
          <div className="text-red-500 text-center p-4 border border-red-200 rounded-lg">
            {actionData.error}
          </div>
        )}

        <div className="flex justify-center pt-6">
          <Button type="submit" size="lg" className="px-16">
            {isEdit ? "Update Commission" : "Submit Commission"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
