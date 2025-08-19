import { useState } from "react";
import { Form, Link, Outlet } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { COMMISSION_CATEGORIES } from "../constants";
import { Input } from "~/components/ui/input";
import { Marquee3D } from "~/common/components/marquee3d";
import type { Route } from "./+types/commissions-layout";
import { getImagesByCategory } from "../queries";
import type { Database } from "database.types";
import { makeSSRClient } from "~/supa-client";
import type { SupabaseClient } from "@supabase/supabase-js";

type CategoryType = Database["public"]["Enums"]["commission_category"];

export const meta: Route.MetaFunction = () => {
  return [{ title: "Commissions" }];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const category = params.category;

  // category가 없으면 빈 배열 반환 (기본값)
  if (!category) {
    return { categoryImages: [] };
  }

  const { client } = await makeSSRClient(request);
  const categoryImages = await getImagesByCategory(client, {
    category: category as CategoryType,
  });
  return { categoryImages };
};

export default function CommissionsLayout({
  loaderData,
}: Route.ComponentProps) {
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center mb-3 md:mb-5">
        <Marquee3D images={loaderData.categoryImages} />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-8 gap-5 lg:gap-8">
        <div className="w-full lg:col-span-2">
          <div className="border rounded-lg p-4 md:p-6 lg:p-8 lg:sticky lg:top-20 space-y-6">
            {/* <div className="flex items-center gap-2">
              <span className="text-sm">지금 바로 접수 가능한 작가만 보기</span>
              <Switch
                checked={isSwitchOn}
                onCheckedChange={(checked) => setIsSwitchOn(checked)}
              />
            </div> */}
            <div>
              <Accordion
                type="single"
                collapsible
                defaultValue="category"
                className="space-y-2"
              >
                <AccordionItem value="category">
                  <AccordionTrigger className="text-base">
                    Category
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pt-2">
                      {COMMISSION_CATEGORIES.map((category) => (
                        <Button
                          key={category.value}
                          asChild
                          variant="outline"
                          className="justify-start"
                        >
                          <Link to={`/commissions/${category.value}`}>
                            {category.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {/* <div>
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="price">
                  <AccordionTrigger className="text-base">
                    Price
                  </AccordionTrigger>
                  <AccordionContent>
                    <Form className="flex flex-col gap-4 pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="최소 금액"
                            className="flex-1"
                          />
                          <span>~</span>
                          <Input
                            type="number"
                            placeholder="최대 금액"
                            className="flex-1"
                          />
                          <span>원</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button size="sm">Apply</Button>
                      </div>
                    </Form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div> */}
          </div>
        </div>
        <div className="lg:col-span-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
