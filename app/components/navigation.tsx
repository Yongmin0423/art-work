import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { cn } from "~/lib/utils";

const menus = [
  {
    name: "작품 둘러보기", // Artworks
    to: "/artworks",
    items: [
      {
        name: "캐릭터 일러스트",
        description: "다양한 스타일의 캐릭터 일러스트를 찾아보세요.",
        to: "/artworks/character-illustration",
      },
      {
        name: "일러스트",
        description: "삽화, 컨셉 아트 등 다양한 일러스트를 만나보세요.",
        to: "/artworks/illustration",
      },
      {
        name: "버추얼 3D",
        description: "버추얼 유튜버, 3D 모델링 작품을 확인하세요.",
        to: "/artworks/virtual-3d",
      },
      {
        name: "Live2D",
        description: "생동감 넘치는 Live2D 모델 및 애니메이션을 찾아보세요.",
        to: "/artworks/live2d",
      },
      {
        name: "디자인",
        description: "로고, 웹툰 배경, UI/UX 등 다양한 디자인 작업을 의뢰하세요.",
        to: "/artworks/design",
      },
      {
        name: "영상",
        description: "애니메이션, 모션그래픽 등 영상 작품을 감상하고 의뢰하세요.",
        to: "/artworks/video",
      },
      {
        name: "전체 작품 보기",
        description: "모든 카테고리의 작품을 한눈에 살펴보세요.",
        to: "/artworks/all",
      },
    ],
  },
  {
    name: "작가 찾기", // Artists
    to: "/artists",
    items: [
      {
        name: "모든 작가 보기",
        description: "활동 중인 전체 작가님들의 프로필과 포트폴리오를 확인하세요.",
        to: "/artists/all",
      },
      {
        name: "추천 작가",
        description: "실력 있는 추천 작가님들을 만나보세요.",
        to: "/artists/recommended",
      },
      {
        name: "작가 등록하기",
        description: "작가로 활동하고 싶으신가요? 지금 바로 등록하세요.",
        to: "/artists/register", // 또는 /join/artist
      },
    ],
  },
  {
    name: "커뮤니티", // Community
    to: "/community",
    items: [
      {
        name: "전체글 보기",
        description: "커뮤니티의 모든 게시글을 확인하세요.",
        to: "/community/all",
      },
      {
        name: "자유게시판",
        description: "자유롭게 이야기를 나누는 공간입니다.",
        to: "/community/free-board",
      },
      {
        name: "Q&A",
        description: "궁금한 점을 질문하고 답변을 받아보세요.",
        to: "/community/qna",
      },
      {
        name: "팁 & 노하우",
        description: "작가와 고객 모두에게 유용한 정보를 공유합니다.",
        to: "/community/tips",
      },
      {
        name: "새 글 작성",
        description: "커뮤니티에 새로운 글을 작성해보세요.",
        to: "/community/create",
      },
    ],
  },
  {
    name: "후기", // Reviews
    to: "/reviews",
    items: [
      {
        name: "모든 후기 보기",
        description: "커미션 및 작품에 대한 고객님들의 생생한 후기를 확인하세요.",
        to: "/reviews/all",
      },
      {
        name: "후기 작성하기",
        description: "완료된 작업에 대한 후기를 남겨주세요.",
        to: "/reviews/submit",
      },
    ],
  },
  {
    name: "고객센터", // Support
    to: "/support",
    items: [
      {
        name: "FAQ (자주 묻는 질문)",
        description: "자주 묻는 질문과 답변을 모아두었습니다.",
        to: "/support/faq",
      },
      {
        name: "공지사항",
        description: "사이트 관련 중요 소식 및 업데이트를 확인하세요.",
        to: "/support/announcements",
      },
      {
        name: "1:1 문의하기",
        description: "궁금한 점이나 문제가 있다면 문의해주세요.",
        to: "/support/contact",
      },
      {
        name: "이용 가이드",
        description: "사이트 이용 방법을 안내해드립니다.",
        to: "/support/guide",
      },
    ],
  },
];

export default function Navigation() {
  return (
    <nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
      <div className="flex items-center">
        <Link to="/" className="font-bold tracking-tighter text-lg">
          Arkwork
        </Link>
        <Separator orientation="vertical" className="h-6 mx-4" />
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.name}>
                      {menu.items ? (
                  <>
                    <Link to={menu.to}>
                      <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                    </Link>
                    <NavigationMenuContent>
                      <ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
                        {menu.items?.map((item) => (
                          <NavigationMenuItem
                            key={item.name}
                            className={cn([
                              "select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent",
                              item.to === "/products/promote" &&
                                "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                              item.to === "/jobs/submit" &&
                                "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                            ])}
                          >
                            <NavigationMenuLink asChild>
                              <Link
                                className="p-3 space-y-1 block leading-none no-underline outline-none"
                                to={item.to}
                              >
                                <span className="text-sm font-medium leading-none">
                                  {item.name}
                                </span>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                    {menu.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}