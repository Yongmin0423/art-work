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
import { Button } from "./ui/button";
import {
  BellIcon,
  ClipboardListIcon,
  CreditCardIcon,
  HeartIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LogOutIcon,
  MenuIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "~/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

const menus = [
  {
    name: "커미션 둘러보기",
    to: "/commissions",
    items: [
      {
        name: "캐릭터 일러스트",
        description:
          "다양한 스타일의 캐릭터 일러스트 샘플을 보고 작가님을 찾아보세요.",
        to: "/commissions/character",
      },
      {
        name: "일러스트",
        description:
          "삽화, 컨셉 아트 등 다양한 일러스트 샘플을 만나보고 작가님과 연결되세요.",
        to: "/commissions/illustration",
      },
      {
        name: "버추얼 3D",
        description:
          "버추얼 유튜버, 3D 모델링 샘플 작품을 확인하고 해당 작가님께 문의하세요.",
        to: "/commissions/virtual-3d",
      },
      {
        name: "Live2D",
        description:
          "생동감 넘치는 Live2D 모델 및 애니메이션 샘플을 통해 전문가를 찾아보세요.",
        to: "/commissions/live2d",
      },
      {
        name: "디자인",
        description:
          "로고, 웹툰 배경, UI/UX 등 다양한 디자인 샘플을 확인하고 작가님을 선택하세요.",
        to: "/commissions/design",
      },
      {
        name: "영상",
        description:
          "애니메이션, 모션그래픽 등 영상 샘플을 감상하고 제작 가능한 작가님을 찾아보세요.",
        to: "/commissions/video",
      },
      {
        name: "커미션 등록하기",
        description: "커미션을 받기 위해서 폼을 작성해보세요.",
        to: "/commissions/create",
      },
    ],
  },
  {
    name: "커뮤니티",
    to: "/community",
    items: [
      {
        name: "커뮤니티",
        description: "커뮤니티의 게시글을 확인하세요.",
        to: "/community",
      },
      {
        name: "새 글 작성",
        description: "커뮤니티에 새로운 글을 작성해보세요.",
        to: "/community/create",
      },
    ],
  },
  {
    name: "후기",
    to: "/reviews",
    items: [
      {
        name: "모든 후기 보기",
        description:
          "커미션 및 작품에 대한 고객님들의 생생한 후기를 확인하세요.",
        to: "/reviews",
      },
      {
        name: "후기 작성하기",
        description: "완료된 작업에 대한 후기를 남겨주세요.",
        to: "/reviews/submit",
      },
    ],
  },
  // {
  //   name: "고객센터",
  //   to: "/support",
  //   items: [
  //     {
  //       name: "FAQ (자주 묻는 질문)",
  //       description: "자주 묻는 질문과 답변을 모아두었습니다.",
  //       to: "/support/faq",
  //     },
  //     {
  //       name: "공지사항",
  //       description: "사이트 관련 중요 소식 및 업데이트를 확인하세요.",
  //       to: "/support/announcements",
  //     },
  //     {
  //       name: "1:1 문의하기",
  //       description: "궁금한 점이나 문제가 있다면 문의해주세요.",
  //       to: "/support/contact",
  //     },
  //     {
  //       name: "이용 가이드",
  //       description: "사이트 이용 방법을 안내해드립니다.",
  //       to: "/support/guide",
  //     },
  //   ],
  // },
];

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  hasMessages,
  avatarUrl,
  username,
  name,
  isAdmin = false,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
  avatarUrl?: string | null;
  username?: string;
  name?: string;
  isAdmin?: boolean;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex px-4 md:px-8 lg:px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
      <div className="flex items-center">
        <Link to="/" className="font-bold tracking-tighter text-lg">
          Arkwork
        </Link>
        <Separator
          orientation="vertical"
          className="h-6 mx-4 hidden md:block"
        />
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col p-6 space-y-4">
                {menus.map((menu) => (
                  <div key={menu.name} className="space-y-3">
                    <Link
                      to={menu.to}
                      className="text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {menu.name}
                    </Link>
                    {menu.items && (
                      <div className="grid gap-2 pl-4">
                        {menu.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.to}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <NavigationMenu>
            <NavigationMenuList>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.name}>
                  {menu.items ? (
                    <>
                      <Link to={menu.to}>
                        <NavigationMenuTrigger>
                          {menu.name}
                        </NavigationMenuTrigger>
                      </Link>
                      <NavigationMenuContent>
                        <ul className="grid w-[600px] font-light gap-3 p-4 md:grid-cols-1 lg:grid-cols-2">
                          {menu.items?.map((item) => (
                            <NavigationMenuItem
                              key={item.name}
                              className={cn([
                                "select-none rounded-md transition-colors focus:bg-accent hover:bg-accent",
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
        )}
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2 md:gap-4">
          {/* <Button size="icon" variant="ghost" asChild className="relative">
            <Link to="/my/notifications">
              <BellIcon className="size-4" />
              {hasNotifications && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            asChild
            className="relative items-center"
          >
            <Link to="/my/messages">
              <MessageCircleIcon className="size-4" />
              {hasMessages && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 md:size-9">
                {avatarUrl && <AvatarImage src={avatarUrl} />}
                <AvatarFallback>{name?.[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">{name}</span>
                <span className="text-xs text-muted-foreground">
                  @{username}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/dashboard">
                    <HomeIcon className="size-4 mr-2" />
                    대시보드
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* 내 의뢰 */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/commissions/requested">
                    <ShoppingCartIcon className="size-4 mr-2" />
                    의뢰한 커미션
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/commissions/liked">
                    <HeartIcon className="size-4 mr-2" />
                    좋아요한 커미션
                  </Link>
                </DropdownMenuItem>
                {/* TODO: MVP 이후 구현 예정
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/reviews">
                    <StarIcon className="size-4 mr-2" />
                    내가 쓴 후기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/favorites">
                    <HeartIcon className="size-4 mr-2" />
                    찜한 작가
                  </Link>
                </DropdownMenuItem>
                */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* 작가 활동 */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/commissions/received">
                    <ClipboardListIcon className="size-4 mr-2" />
                    받은 커미션
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/commissions/my-commissions">
                    <ClipboardListIcon className="size-4 mr-2" />내 커미션 관리
                  </Link>
                </DropdownMenuItem>
                {/* TODO: MVP 이후 구현 예정
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/artworks">
                    <ImageIcon className="size-4 mr-2" />
                    포트폴리오 관리
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/earnings">
                    <CreditCardIcon className="size-4 mr-2" />
                    수익 관리
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/artist/reviews">
                    <MessageSquareIcon className="size-4 mr-2" />
                    받은 후기
                  </Link>
                </DropdownMenuItem>
                */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* 관리자 메뉴 - 관리자만 보임 */}
              {isAdmin && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/my/admin/commissions">
                        <ClipboardListIcon className="size-4 mr-2" />
                        커미션 승인 관리
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/my/admin/orders">
                        <ShoppingCartIcon className="size-4 mr-2" />
                        주문 관리
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              {/* 계정 */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/profile">
                    <UserIcon className="size-4 mr-2" />내 프로필
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/notifications">
                    <BellIcon className="size-4 mr-2" />
                    알림 설정
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4 mr-2" />
                    계정 설정
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {/* <DropdownMenuSeparator /> */}
              {/* 고객 지원
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/support">
                    <HelpCircleIcon className="size-4 mr-2" />
                    도움말 센터
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/support/announcements">
                    <InfoIcon className="size-4 mr-2" />
                    공지사항/블로그
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/auth/logout">
                  <LogOutIcon className="size-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            asChild
            variant="secondary"
            size={isMobile ? "sm" : "default"}
          >
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild size={isMobile ? "sm" : "default"}>
            <Link to="/auth/join">Join</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
