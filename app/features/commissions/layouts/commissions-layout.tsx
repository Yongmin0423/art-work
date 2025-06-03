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

type CategoryType = Database["public"]["Enums"]["commission_category"];

export const meta: Route.MetaFunction = () => {
  return [{ title: "Commissions" }];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const category = params.category;
  if (!category) {
    throw new Error("Category parameter is required");
  }

  const categoryImages = await getImagesByCategory({
    category: category as CategoryType,
  });
  return { categoryImages };
};

export default function CommissionsLayout({
  loaderData,
}: Route.ComponentProps) {
  const [isSwitchOn, setIsSwitchOn] = useState(true);

  return (
    <div>
      <div className="flex flex-col items-center mb-5">
        <Marquee3D images={loaderData.categoryImages} />
      </div>
      <div className="grid grid-cols-8 gap-10">
        <div className="col-span-2">
          <div className="border w-3/4 p-10 sticky top-20">
            <div className="flex items-center gap-2">
              <span className="text-sm">지금 바로 접수 가능한 작가만 보기</span>
              <Switch
                checked={isSwitchOn}
                onCheckedChange={(checked) => setIsSwitchOn(checked)}
              />
            </div>
            <div>
              <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2">
                      {COMMISSION_CATEGORIES.map((category) => (
                        <Button key={category.value} asChild variant="outline">
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
            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="price">
                  <AccordionTrigger>Price</AccordionTrigger>
                  <AccordionContent>
                    <Form className="flex flex-col gap-5">
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
                      <div className="flex justify-center gap-5">
                        <Button>Apply</Button>
                      </div>
                    </Form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
