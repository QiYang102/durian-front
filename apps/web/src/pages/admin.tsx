import { useState, useEffect } from "react";

import {
  createFileRoute,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import {
  HomeIcon,
  LogOut,
  Globe,
  ChevronRight,
  ClipboardList,
  UserCircle,
  ChevronDown,
  Package,
  Tag,
  Settings,
  Image,
} from "lucide-react";

import { useSession } from "@ttm/context";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Text } from "@/components/ui/Text";
import LanguageSelector from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";
import DuriNowLogo from "@/assets/DurianNow_Logo.png";

const ADMIN_NAVBAR = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    to: "/admin",
  },
  {
    title: "Orders",
    icon: ClipboardList,
    to: "/admin/orders",
  },
  {
    title: "Products",
    icon: Package,
    to: "/admin/products",
  },
  {
    title: "Promo Codes",
    icon: Tag,
    to: "/admin/promo-codes",
  },
  {
    title: "Banners",
    icon: Image,
    to: "/admin/banners",
  },
  {
    title: "Settings",
    icon: Settings,
    to: "/admin/settings",
  },
];

function AppSidebar() {
  const { user } = useSession();
  const version = import.meta.env.VITE_VERSION;
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar
      className="group/sidebar bg-slate-50 text-black dark:bg-slate-900 dark:text-white"
      collapsible="icon"
      variant="floating"
    >
      <SidebarHeader className="border-b p-4 gap-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className="hidden group-data-[state=expanded]:flex w-auto items-center rounded-md bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <img
              className="h-8 object-contain"
              src={DuriNowLogo}
              alt="DuriNow"
            />
          </div>
          <SidebarTrigger className="h-5 w-5" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAVBAR.map((item) => {
                const isActive = currentPath === item.to;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.to}
                        preload={false}
                        search={true}
                        params={true}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfilePopover />
          </SidebarMenuItem>
        </SidebarMenu>
        <div
          className="hidden group-data-[state=expanded]:block px-3 py-2 text-center"
        >
          <Text
            variant="caption"
            color="systemBlack"
          >
            {`version: ${version}`}
          </Text>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function UserProfilePopover() {
  const { user, signOut } = useSession();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    signOut();
    navigate({ to: "/durian", replace: true });
  };

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <UserCircle className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user?.fullname || "Admin"}
            </span>
            <span className="truncate text-xs">
              {user?.email || "admin@durinow.com"}
            </span>
          </div>
          <ChevronRight
            className={`ml-auto size-4 transition-transform duration-200 ease-in-out ${menuOpen ? "rotate-0" : "rotate-90"}`}
          />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <div className="p-2">
              <LanguageSelector isCollapsed={false} />
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LayoutComponent() {
  const { user, isLoading } = useSession();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const match = document.cookie.match(/sidebar:open=(true|false)/);
    return match ? match[1] === "true" : true;
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate({ to: "/durian", replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSidebarOpenChange = (open: boolean) => {
    setSidebarOpen(open);
    document.cookie = `sidebar:open=${open}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={handleSidebarOpenChange}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1">
          <main className="w-full">
            <div className="w-full bg-slate-50 dark:bg-slate-950">
              <div>
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/admin")({
  component: LayoutComponent,
});
