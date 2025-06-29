import { HomeIcon, ClipboardListIcon, MenuIcon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <SidebarProvider className="flex min-h-full w-full">
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden">
            <MenuIcon className="size-5" />
          </SidebarTrigger>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 font-semibold">
          artwork
        </div>
        <div className="w-10" /> {/* 우측 여백 맞추기용 */}
      </div>
      <Sidebar className="pt-16" variant="floating">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === "/admin"}
              >
                <Link to="/admin">
                  <HomeIcon className="size-4" />
                  <span>관리자 대시보드</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith("/admin/commissions")}
              >
                <Link to="/admin/commissions">
                  <ClipboardListIcon className="size-4" />
                  <span>커미션 승인 관리</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="w-full h-full pt-16">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
