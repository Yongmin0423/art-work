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
  BanknoteIcon,
  BarChart3Icon,
  BellIcon,
  ClipboardListIcon,
  Edit3Icon,
  FilePlus2Icon,
  GalleryHorizontalEndIcon,
  HeartIcon,
  HelpCircleIcon,
  ImageUpIcon,
  InfoIcon,
  LogOutIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  SettingsIcon,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar';

const menus = [
  {
    name: '작품 둘러보기', // Artworks
    to: '/artworks',
    items: [
      {
        name: '캐릭터 일러스트',
        description:
          '다양한 스타일의 캐릭터 일러스트를 찾아보세요.',
        to: '/artworks/character-illustration',
      },
      {
        name: '일러스트',
        description:
          '삽화, 컨셉 아트 등 다양한 일러스트를 만나보세요.',
        to: '/artworks/illustration',
      },
      {
        name: '버추얼 3D',
        description:
          '버추얼 유튜버, 3D 모델링 작품을 확인하세요.',
        to: '/artworks/virtual-3d',
      },
      {
        name: 'Live2D',
        description:
          '생동감 넘치는 Live2D 모델 및 애니메이션을 찾아보세요.',
        to: '/artworks/live2d',
      },
      {
        name: '디자인',
        description:
          '로고, 웹툰 배경, UI/UX 등 다양한 디자인 작업을 의뢰하세요.',
        to: '/artworks/design',
      },
      {
        name: '영상',
        description:
          '애니메이션, 모션그래픽 등 영상 작품을 감상하고 의뢰하세요.',
        to: '/artworks/video',
      },
      {
        name: '전체 작품 보기',
        description:
          '모든 카테고리의 작품을 한눈에 살펴보세요.',
        to: '/artworks/all',
      },
    ],
  },
  {
    name: '작가 찾기', // Artists
    to: '/artists',
    items: [
      {
        name: '모든 작가 보기',
        description:
          '활동 중인 전체 작가님들의 프로필과 포트폴리오를 확인하세요.',
        to: '/artists/all',
      },
      {
        name: '추천 작가',
        description:
          '실력 있는 추천 작가님들을 만나보세요.',
        to: '/artists/recommended',
      },
      {
        name: '작가 등록하기',
        description:
          '작가로 활동하고 싶으신가요? 지금 바로 등록하세요.',
        to: '/artists/register', // 또는 /join/artist
      },
    ],
  },
  {
    name: '커뮤니티', // Community
    to: '/community',
    items: [
      {
        name: '전체글 보기',
        description: '커뮤니티의 모든 게시글을 확인하세요.',
        to: '/community/all',
      },
      {
        name: '자유게시판',
        description: '자유롭게 이야기를 나누는 공간입니다.',
        to: '/community/free-board',
      },
      {
        name: 'Q&A',
        description:
          '궁금한 점을 질문하고 답변을 받아보세요.',
        to: '/community/qna',
      },
      {
        name: '팁 & 노하우',
        description:
          '작가와 고객 모두에게 유용한 정보를 공유합니다.',
        to: '/community/tips',
      },
      {
        name: '새 글 작성',
        description: '커뮤니티에 새로운 글을 작성해보세요.',
        to: '/community/create',
      },
    ],
  },
  {
    name: '후기', // Reviews
    to: '/reviews',
    items: [
      {
        name: '모든 후기 보기',
        description:
          '커미션 및 작품에 대한 고객님들의 생생한 후기를 확인하세요.',
        to: '/reviews/all',
      },
      {
        name: '후기 작성하기',
        description:
          '완료된 작업에 대한 후기를 남겨주세요.',
        to: '/reviews/submit',
      },
    ],
  },
  {
    name: '고객센터', // Support
    to: '/support',
    items: [
      {
        name: 'FAQ (자주 묻는 질문)',
        description:
          '자주 묻는 질문과 답변을 모아두었습니다.',
        to: '/support/faq',
      },
      {
        name: '공지사항',
        description:
          '사이트 관련 중요 소식 및 업데이트를 확인하세요.',
        to: '/support/announcements',
      },
      {
        name: '1:1 문의하기',
        description:
          '궁금한 점이나 문제가 있다면 문의해주세요.',
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
                      <NavigationMenuTrigger>
                        {menu.name}
                      </NavigationMenuTrigger>
                    </Link>
                    <NavigationMenuContent>
                      <ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
                        {menu.items?.map((item) => (
                          <NavigationMenuItem
                            key={item.name}
                            className={cn([
                              'select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent',
                              item.to ===
                                '/products/promote' &&
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
                    <BarChart3Icon className="size-4 mr-2" />
                    대시보드
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 창작 및 판매 (작가 활동 중심) */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/artworks">
                    <GalleryHorizontalEndIcon className="size-4 mr-2" />
                    내 작품 관리
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/earnings">
                    <BanknoteIcon className="size-4 mr-2" />
                    수익/정산 관리
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 의뢰 및 구매 (의뢰인 활동 중심) */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/commissions/requested">
                    <ClipboardListIcon className="size-4 mr-2" />
                    나의 의뢰 목록
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/commissions/new">
                    <FilePlus2Icon className="size-4 mr-2" />
                    새 의뢰 요청
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 공통 기능 */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/messages">
                    <MessageSquareIcon className="size-4 mr-2" />
                    메시지
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/favorites">
                    <HeartIcon className="size-4 mr-2" />
                    찜한 목록
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/my/reviews">
                    <StarIcon className="size-4 mr-2" />
                    나의 후기
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 내 계정 관리 */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/profile/me">
                    {' '}
                    {/* 혹은 /profile/{userId} */}
                    <UserIcon className="size-4 mr-2" />내
                    프로필 보기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/settings/profile">
                    <Edit3Icon className="size-4 mr-2" />
                    프로필 수정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/settings/account">
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
                  <Link to="/help">
                    <HelpCircleIcon className="size-4 mr-2" />
                    도움말 센터
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                >
                  <Link to="/blog">
                    {' '}
                    {/* 또는 /announcements */}
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
