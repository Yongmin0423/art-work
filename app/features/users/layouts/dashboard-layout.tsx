import {
  HomeIcon,
  PackageIcon,
  RocketIcon,
  SparklesIcon,
  ShoppingCartIcon,
  ClipboardListIcon,
  MessageSquareIcon,
  HeartIcon,
  UserIcon,
  CreditCardIcon,
  StarIcon,
  ImageIcon,
  SettingsIcon,
  BellIcon,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '~/components/ui/sidebar';

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <SidebarProvider className="flex min-h-full">
      <Sidebar
        className="pt-16"
        variant="floating"
      >
        <SidebarContent>
          {/* 대시보드 홈 */}
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/dashboard'}
                >
                  <Link to="/my/dashboard">
                    <HomeIcon className="size-4" />
                    <span>대시보드</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* 커미션 관리 (의뢰자 관점) */}
          <SidebarGroup>
            <SidebarGroupLabel>내 의뢰</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/commissions/requested'}
                >
                  <Link to="/my/commissions/requested">
                    <ShoppingCartIcon className="size-4" />
                    <span>의뢰한 커미션</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/reviews'}
                >
                  <Link to="/my/reviews">
                    <StarIcon className="size-4" />
                    <span>내가 쓴 후기</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/favorites'}
                >
                  <Link to="/my/favorites">
                    <HeartIcon className="size-4" />
                    <span>찜한 작가</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* 작가 관리 (작가 관점) */}
          <SidebarGroup>
            <SidebarGroupLabel>작가 활동</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/commissions/received'}
                >
                  <Link to="/my/commissions/received">
                    <ClipboardListIcon className="size-4" />
                    <span>받은 커미션</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/artworks'}
                >
                  <Link to="/my/artworks">
                    <ImageIcon className="size-4" />
                    <span>포트폴리오 관리</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/earnings'}
                >
                  <Link to="/my/earnings">
                    <CreditCardIcon className="size-4" />
                    <span>수익 관리</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/artist/reviews'}
                >
                  <Link to="/my/artist/reviews">
                    <MessageSquareIcon className="size-4" />
                    <span>받은 후기</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* 계정 관리 */}
          <SidebarGroup>
            <SidebarGroupLabel>계정</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/profile'}
                >
                  <Link to="/my/profile">
                    <UserIcon className="size-4" />
                    <span>프로필 설정</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/notifications'}
                >
                  <Link to="/my/notifications">
                    <BellIcon className="size-4" />
                    <span>알림 설정</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/my/settings'}
                >
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4" />
                    <span>계정 설정</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
