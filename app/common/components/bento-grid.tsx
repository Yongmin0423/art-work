import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";

import { cn } from "~/lib/utils";
import { BentoCard, BentoGrid } from "~/components/magicui/bento-grid";
import { Marquee } from "~/components/magicui/marquee";
import CommunityPage from "~/features/community/pages/community-page";
import { Hero } from "~/components/hero";
import type { CategoryShowcase } from "~/common/schema";

// 기본 fallback 데이터
const defaultFiles = [
  {
    img: "https://storage.googleapis.com/static.fastcampus.co.kr/prod/uploads/202211/131729-914/illust-ekina-portfolio-04.png",
    title: "Character Design",
    alt: "Character Design Category",
  },
  {
    img: "https://cdn.gameinsight.co.kr/news/photo/202007/20941_49865_1849.gif",
    title: "Animation",
    alt: "Animation Category",
  },
  {
    img: "https://artmug.kr/image/cate_banner/cateBanner13_1.jpg",
    title: "Illustration",
    alt: "Illustration Category",
  },
  {
    img: "https://artmug.kr/image/cate_banner/ECA09CEBAAA9-EC9786EC9D8C-2_2.jpg",
    title: "Digital Art",
    alt: "Digital Art Category",
  },
  {
    img: "https://artmug.kr/image/cate_banner/cateBanner14.jpg",
    title: "Concept Art",
    alt: "Concept Art Category",
  },
];

interface BentoDemoProps {
  categoryShowcase?: CategoryShowcase[];
}

export function BentoDemo({ categoryShowcase = [] }: BentoDemoProps) {
  // categoryShowcase 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const files =
    categoryShowcase.length > 0
      ? categoryShowcase.map((item) => ({
          img: item.image_url,
          title: item.title,
          alt: item.alt_text,
        }))
      : defaultFiles;

  const features = [
    {
      name: "커뮤니티",
      description: "We automatically save your files as you type.",
      href: "#",
      cta: "Learn more",
      className: "col-span-3 lg:col-span-1",
      background: (
        <div>
          <Hero
            className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105"
            title="Community"
            subtitle="Ask questions, share ideas, and connect with other developers"
          />
        </div>
      ),
    },
    {
      name: "카테고리",
      description: "See categories",
      href: "#",
      cta: "See categories",
      className: "col-span-3 lg:col-span-2",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center justify-center w-full gap-2">
                <div className="flex flex-col">
                  <figcaption className="w-full h-full flex items-center justify-center">
                    <img
                      className="object-cover w-full h-full"
                      src={f.img}
                      alt={f.alt || f.title || "category img"}
                    />
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.title}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
  ];

  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
