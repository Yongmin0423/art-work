import { Link } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Separator } from './ui/separator';
import { cn } from '~/lib/utils';
import { Button } from './ui/button';
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
  MessageCircleIcon,
  MessageSquareIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const menus = [
  {
    name: '커미션 둘러보기',
    to: '/commissions',
    items: [
      {
        name: '캐릭터 일러스트',
        description:
          '다양한 스타일의 캐릭터 일러스트 샘플을 보고 작가님을 찾아보세요.',
        to: '/commissions/character',
      },
      {
        name: '일러스트',
        description:
          '삽화, 컨셉 아트 등 다양한 일러스트 샘플을 만나보고 작가님과 연결되세요.',
        to: '/commissions/illustration',
      },
      {
        name: '버추얼 3D',
        description:
          '버추얼 유튜버, 3D 모델링 샘플 작품을 확인하고 해당 작가님께 문의하세요.',
        to: '/commissions/virtual-3d',
      },
      {
        name: 'Live2D',
        description:
          '생동감 넘치는 Live2D 모델 및 애니메이션 샘플을 통해 전문가를 찾아보세요.',
        to: '/commissions/live2d',
      },
      {
        name: '디자인',
        description:
          '로고, 웹툰 배경, UI/UX 등 다양한 디자인 샘플을 확인하고 작가님을 선택하세요.',
        to: '/commissions/design',
      },
      {
        name: '영상',
        description:
          '애니메이션, 모션그래픽 등 영상 샘플을 감상하고 제작 가능한 작가님을 찾아보세요.',
        to: '/commissions/video',
      },
      {
        name: '모든 샘플 보기',
        description:
          '모든 카테고리의 커미션 샘플을 한눈에 살펴보고 마음에 드는 작가님을 찾아보세요.',
        to: '/commissions',
      },
      {
        name: '추천 작가',
        description:
          '실력 있는 추천 작가님들의 프로필과 포트폴리오를 직접 확인하세요.',
        to: '/commissions/recommended',
      },
      {
        name: '작가로 참여하기',
        description: '작가로 활동하고 싶으신가요? 지금 바로 등록하세요.',
        to: '/commissions/join/artist',
      },
    ],
  },
  {
    name: '커뮤니티',
    to: '/community',
    items: [
      {
        name: '커뮤니티',
        description: '커뮤니티의 게시글을 확인하세요.',
        to: '/community',
      },
      {
        name: '새 글 작성',
        description: '커뮤니티에 새로운 글을 작성해보세요.',
        to: '/community/create',
      },
    ],
  },
  {
    name: '후기',
    to: '/reviews',
    items: [
      {
        name: '모든 후기 보기',
        description:
          '커미션 및 작품에 대한 고객님들의 생생한 후기를 확인하세요.',
        to: '/reviews',
      },
      {
        name: '후기 작성하기',
        description: '완료된 작업에 대한 후기를 남겨주세요.',
        to: '/reviews/submit',
      },
    ],
  },
  {
    name: '고객센터',
    to: '/support',
    items: [
      {
        name: 'FAQ (자주 묻는 질문)',
        description: '자주 묻는 질문과 답변을 모아두었습니다.',
        to: '/support/faq',
      },
      {
        name: '공지사항',
        description: '사이트 관련 중요 소식 및 업데이트를 확인하세요.',
        to: '/support/announcements',
      },
      {
        name: '1:1 문의하기',
        description: '궁금한 점이나 문제가 있다면 문의해주세요.',
        to: '/support/contact',
      },
      {
        name: '이용 가이드',
        description: '사이트 이용 방법을 안내해드립니다.',
        to: '/support/guide',
      },
    ],
  },
];

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  hasMessages,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
}) {
  return (
    <nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
      <div className="flex items-center">
        <Link
          to="/"
          className="font-bold tracking-tighter text-lg"
        >
          Arkwork
        </Link>
        <Separator
          orientation="vertical"
          className="h-6 mx-4"
        />
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
                              'select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent',
                              item.to === '/products/promote' &&
                                'col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20',
                              item.to === '/jobs/submit' &&
                                'col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20',
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
                  <Link
                    className={navigationMenuTriggerStyle()}
                    to={menu.to}
                  >
                    {menu.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            asChild
            className="relative"
          >
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
            className="relative"
          >
            <Link to="/my/messages">
              <MessageCircleIcon className="size-4" />
              {hasMessages && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/yongmin0423.png" />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">Yongmin</span>
                <span className="text-xs text-muted-foreground">
                  @yongmin0423
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/dashboard">
                    <HomeIcon className="size-4 mr-2" />
                    대시보드
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 내 의뢰 */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/commissions/requested">
                    <ShoppingCartIcon className="size-4 mr-2" />
                    의뢰한 커미션
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/reviews">
                    <StarIcon className="size-4 mr-2" />
                    내가 쓴 후기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/favorites">
                    <HeartIcon className="size-4 mr-2" />
                    찜한 작가
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 작가 활동 */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/commissions/received">
                    <ClipboardListIcon className="size-4 mr-2" />
                    받은 커미션
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/artworks">
                    <ImageIcon className="size-4 mr-2" />
                    포트폴리오 관리
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/earnings">
                    <CreditCardIcon className="size-4 mr-2" />
                    수익 관리
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/artist/reviews">
                    <MessageSquareIcon className="size-4 mr-2" />
                    받은 후기
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 계정 */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/users/yongmin0423">
                    <UserIcon className="size-4 mr-2" />내 프로필 보기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/profile">
                    <UserIcon className="size-4 mr-2" />
                    프로필 설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/notifications">
                    <BellIcon className="size-4 mr-2" />
                    알림 설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4 mr-2" />
                    계정 설정
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 고객 지원 */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/support">
                    <HelpCircleIcon className="size-4 mr-2" />
                    도움말 센터
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/support/announcements">
                    <InfoIcon className="size-4 mr-2" />
                    공지사항/블로그
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="cursor-pointer"
              >
                <Link to="/auth/logout">
                  <LogOutIcon className="size-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="secondary"
          >
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/auth/join">Join</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
