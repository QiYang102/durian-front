import { useEffect, useRef, useState } from "react";

import {
  createFileRoute,
  Outlet,
  useRouterState,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import _ from "lodash";
import {
  HomeIcon,
  KeyRound,
  UserCircle,
  Users,
  Star,
  ScrollText,
  Megaphone,
  ClipboardListIcon,
  LogOut,
  Globe,
  ChevronRight,
  ChevronLeft,
  BookDashed,
  User,
  Shield,
  FileUp,
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  ChevronsDownUpIcon,
  CoffeeIcon,
  Newspaper,
  Tag,
  FileCheck,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  // useSidebar, // removed to avoid subscribing to sidebar hover state
} from "@/components/ui/Sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/Collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Text } from "@/components/ui/Text";
import { PageViewTracker } from "@/components/PageViewTracker";
import LanguageSelector from "@/components/LanguageSelector";
import { AccountEvents } from "@ttm/api/types/tracker";
import { clearUserContext, trackEvent } from "@/lib/analytics";
import MyTaskStory from "@/components/rightPanel/MyTaskStory";
import { getHttpsImageUrl } from "@ttm/utils/src/transformHttp";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import {
  useInteractionTracking,
  useKeyboardShortcuts,
  useNavigationMetrics,
} from "@/components/Telemetry";

import { listTeams } from "@ttm/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { cn } from "@/lib/utils";
import { title } from "process";

const DEFAULT_NAVBAR = [
  {
    title: "Home",
    feature: "home",
    icon: HomeIcon,
    type: "basic",
    to: "/",
  },
  {
    title: "Sample",
    // feature: "sample",
    icon: Star,
    type: "basic",
    to: "sample",
  },
  {
    title: "User",
    feature: "sample",
    icon: User,
    type: "basic",
    to: "/user",
  },
  {
    title: "Role & Access",
    feature: "role",
    icon: KeyRound,
    type: "basic",
    to: "/role",
  },
  {
    title: "Team",
    feature: "sample",
    icon: Users,
    type: "basic",
    to: "/team",
  },
  {
    title: "Iteration",
    feature: "sample",
    icon: ScrollText,
    type: "basic",
    to: "/iteration",
  },
  {
    title: "Storyboard",
    feature: "sample",
    icon: ClipboardListIcon,
    type: "basic",
    to: "/storyboard",
  },
  {
    title: "My Task",
    feature: "sample",
    icon: FileCheck,
    type: "basic",
    to: "/my-task",
  },
  {
    title: "Backlog",
    feature: "sample",
    icon: BookDashed,
    type: "basic",
    to: "/story-drafted",
  },
  {
    title: "Tag Registry",
    feature: "sample",
    icon: Tag,
    type: "basic",
    to: "/tag-registry",
  },
  {
    title: "Season Summary",
    feature: "sample",
    icon: Newspaper,
    type: "basic",
    to: "/season-summary",
  },
  {
    title: "Kopibeng",
    feature: "sample",
    icon: CoffeeIcon,
    type: "basic",
    to: "/kopibeng",
  },
  {
    title: "Announcement",
    feature: "sample",
    icon: Megaphone,
    type: "basic",
    to: "/announcement",
  },
  {
    title: "Deployment",
    feature: "sample",
    icon: FileUp,
    type: "collapsible",
    to: "/deployment",
    children: [
      {
        title: "Overview",
        feature: "sample",
        icon: Eye,
        to: "/deployment",
      },
      {
        title: "Template",
        feature: "sample",
        icon: FileText,
        to: "/deployment/template",
      },
    ],
  },
  {
    title: "Leave",
    feature: "sample",
    icon: CalendarDays,
    type: "basic",
    to: "/leave",
  },
];

function TeamCheckIn() {
  const router = useRouter();

  type Team = {
    id: number;
    name?: string;
  };

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Get Team List
  const { data, isLoading, isError, refetch } = listTeams(["teams"], {
    filter: {
      is_active: "true",
    },
  });
  const { teams } = data || {};

  // Get User Last Time Selected Team
  useEffect(() => {
    const localStorageTeamId = localStorage.getItem("teamId");
    const localStorageTeamName = localStorage.getItem("teamName");

    if (localStorageTeamId && localStorageTeamName) {
      const teamObj = {
        id: Number(localStorageTeamId),
        name: localStorageTeamName,
      };
      setSelectedTeam(teamObj);
    }
  }, []);

  const handleCheckOut = () => {
    setSelectedTeam(null);
    localStorage.removeItem("teamId");
    localStorage.removeItem("teamName");
    window.location.reload();
  };

  const handleCheckIn = (id: number, name: string) => {
    const teamObj = {
      id: id,
      name: name,
    };

    if (
      selectedTeam?.id === teamObj.id &&
      selectedTeam?.name === teamObj.name
    ) {
      return;
    }

    setSelectedTeam(teamObj);
    localStorage.setItem("teamId", id.toString());
    localStorage.setItem("teamName", name);
    window.location.reload();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardContent>
            <Loading
              showText
              text="Loading teams..."
              size="lg"
              className="items-center justify-center"
            />
          </CardContent>
        </Card>
      );
    }

    if (isError) {
      return (
        <ErrorDisplay
          title="Failed to load teams"
          message="We couldn't load the teams data. Please check your connection and try again."
          onRetry={() => {
            refetch();
          }}
          retryText="Reload Data"
        />
      );
    }

    if (!teams || teams.length === 0) {
      return (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No teams found.
              </h3>
              <p className="text-gray-500">
                Get started by creating a new team
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <DropdownMenuLabel className="py-1 text-xs font-semibold text-gray-600">
          Teams
        </DropdownMenuLabel>

        {!isLoading &&
          teams &&
          teams.map((team) => {
            const isSelected = team.id === selectedTeam?.id;

            return (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleCheckIn(team.id, team.name)}
                className={`max-w-60 flex items-center ${isSelected ? "bg-gray-50" : ""}`}
              >
                <p className="truncate">{team.name}</p>
              </DropdownMenuItem>
            );
          })}

        {selectedTeam && <DropdownMenuSeparator className="mb-3" />}

        {selectedTeam && (
          <DropdownMenuItem
            onClick={() => handleCheckOut()}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            Check Out
          </DropdownMenuItem>
        )}
      </>
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hidden group-data-[state=expanded]:block border focus-visible:outline-none focus-visible:ring-0 border-stone-300"
            >
              <div className="flex flex-row justify-around items-center px-3 h-full">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-300 ease-in-out",
                    selectedTeam ? "bg-green-500" : "bg-gray-400",
                  )}
                />
                <div className="flex flex-1 max-w-24 h-full items-center justify-center">
                  <h4 className="items-center font-medium leading-tight text-center truncate">
                    {selectedTeam ? selectedTeam.name : "Select Team"}
                  </h4>
                </div>
                <ChevronsDownUpIcon size={16} />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="start"
            className="rounded-lg p-3 pb-5"
          >
            {renderContent()}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function AppSidebar() {
  const [navbar, setNavBar] = useState<any[]>([]);
  const { user } = useSession();
  const version = import.meta.env.VITE_VERSION;

  const { trackInteraction, NotificationBanner } = useInteractionTracking();
  const { MetricAlertBanner, MetricIndicators } = useNavigationMetrics();
  const { shortcutActive } = useKeyboardShortcuts();

  useEffect(() => {
    if (user?.feature_access) {
      const filterNavbar = (items: any[]) => {
        return _.map(items, (item) => {
          const hasFeatureAccess =
            item.feature === "home" ||
            item.feature === "sample" ||
            item.feature === "customer" ||
            user?.feature_access?.includes(item.feature);

          const filteredChildren = item.children
            ? _.filter(
                item.children,
                (child) =>
                  child.feature === "home" ||
                  child.feature === "sample" ||
                  child.feature === "customer" ||
                  user?.feature_access?.includes(child.feature),
              )
            : [];

          return {
            ...item,
            children: filteredChildren,
            visible: hasFeatureAccess || filteredChildren.length > 0,
          };
        });
      };

      const filteredNavbar = filterNavbar(DEFAULT_NAVBAR);
      const finalNavbar = _.filter(filteredNavbar, { visible: true });

      setNavBar(finalNavbar);
    }
  }, [user?.feature_access]);

  return (
    <Sidebar
      className="group/sidebar bg-slate-50 text-black dark:bg-slate-900 dark:text-white"
      collapsible="icon"
      variant="floating"
    >
      <SidebarHeader className="border-b p-4 gap-3">
        <div className="flex items-center justify-between gap-2">
          <div
            className="hidden group-data-[state=expanded]:flex w-auto items-center rounded-md bg-black p-2 cursor-pointer hover:bg-gray-800 transition-colors"
            onClick={trackInteraction}
          >
            <img
              className="h-6 object-contain"
              src="/images/sidebar-logo.png"
              alt="CodeTinker"
            />
          </div>
          <NotificationBanner />
          <SidebarTrigger className="h-5 w-5" />
        </div>
        <TeamCheckIn />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navbar.map((item) => {
                if (item.type === "collapsible" && item.children?.length > 0) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((subItem: any) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    to={subItem.to}
                                    preload={false}
                                    search={true}
                                    params={true}
                                  >
                                    {subItem.icon && (
                                      <subItem.icon className="h-4 w-4" />
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
        <MetricAlertBanner />
        <MetricIndicators />

        <SidebarMenu>
          <SidebarMenuItem>
            <UserProfilePopover />
          </SidebarMenuItem>
        </SidebarMenu>
        <div
          className={`hidden group-data-[state=expanded]:block px-3 py-2 text-center transition-all duration-300 ${
            shortcutActive
              ? "animate-pulse bg-gradient-to-r from-purple-500 to-pink-500 rounded-md"
              : ""
          }`}
        >
          <Text
            variant="caption"
            color="systemBlack"
            className={shortcutActive ? "text-white font-bold" : ""}
          >
            {shortcutActive
              ? "✨ PX & JY were here! ✨ Ohhohohoho"
              : `version: ${version}`}
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
    trackEvent(AccountEvents.ACCOUNT_LOGOUT_INITIATED);

    clearUserContext();
    signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {user?.image ? (
            <img
              src={getHttpsImageUrl(user.image) ?? ""}
              alt={user.fullname || "User"}
              className="aspect-square size-8 rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <UserCircle className="size-4" />
            </div>
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user?.fullname || "Guest"}
            </span>
            <span className="truncate text-xs">
              {user?.email || "guest@example.com"}
            </span>
          </div>
          <ChevronRight
            className={`ml-auto size-4 transition-transform duration-200 ease-in-out ${menuOpen ? "rotate-0" : "rotate-90"}`}
          />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            to="/account"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/change-password"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Shield className="h-4 w-4" />
            <span>Change Password</span>
          </Link>
        </DropdownMenuItem>

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
  const [isRightOpen, setIsRightOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const match = document.cookie.match(/sidebar:open=(true|false)/);
    return match ? match[1] === "true" : true;
  });
  const [mainHeight, setMainHeight] = useState<number>(0);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const location = useRouterState({
    select: (s) => s.location,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    const match = document.cookie.match(/right-panel:open=(true|false)/);
    if (match) setIsRightOpen(match[1] === "true");
  }, []);

  useEffect(() => {
    const el = contentRef.current;

    const applyHeight = (h: number) => {
      const desired = Math.max(h, window.innerHeight || 0);
      setMainHeight(desired);
    };

    if (!el) {
      applyHeight(window.innerHeight || 0);
      return;
    }

    applyHeight(el.scrollHeight || el.getBoundingClientRect().height);

    const ro = new ResizeObserver(() => {
      applyHeight(el.scrollHeight || el.getBoundingClientRect().height);
    });
    ro.observe(el);

    const onResize = () =>
      applyHeight(el.scrollHeight || el.getBoundingClientRect().height);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [location.pathname]);

  const openRightPanel = () => {
    setIsRightOpen(true);
    document.cookie = `right-panel:open=true`;
  };

  const closeRightPanel = () => {
    setIsRightOpen(false);
    document.cookie = `right-panel:open=false`;
  };

  const handleSidebarOpenChange = (open: boolean) => {
    setSidebarOpen(open);
    document.cookie = `sidebar:open=${open}`;
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={handleSidebarOpenChange}>
      <PageViewTracker />
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        {/* Main content (no ResizablePanelGroup needed) */}
        <div className="flex-1">
          <main className="w-full">
            <div
              ref={panelRef}
              className="w-full bg-slate-50 dark:bg-slate-950"
            >
              <div>
                <Outlet />
              </div>
            </div>
          </main>
        </div>

        <Sheet
          open={isRightOpen}
          onOpenChange={(open) => {
            setIsRightOpen(open);
            document.cookie = `right-panel:open=${open}`;
          }}
        >
          {/* Floating trigger only when closed */}
          {!isRightOpen && (
            <SheetTrigger asChild>
              <button
                aria-label="Open right panel"
                className="fixed right-2 top-1/2 z-50 -translate-y-1/2 rounded-full border bg-white p-2 shadow hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </SheetTrigger>
          )}

          <SheetContent
            side="right"
            // override default padding and width, add borders and dark styles
            className="p-0 w-[min(20vw,480px)] sm:max-w-[400px] bg-white dark:bg-slate-900 border-l dark:border-slate-800"
          >
            <div className="flex h-full flex-col">
              <div className="flex-shrink-0 p-3 border-b dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <Text variant="h3" color="systemBlack">
                    My Task
                  </Text>
                  {/* Close icon is already rendered by SheetContent (top-right X) */}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-3">
                <MyTaskStory />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
}

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
});
