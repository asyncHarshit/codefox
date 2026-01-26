"use client";

import {
  Github,
  BookOpen,
  Settings,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  GitBranch,
  Star,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Logout from "@/module/auth/components/logout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigations = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Repository",
      href: "/dashboard/repository",
      icon: <GitBranch className="w-5 h-5" />,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: <Star className="w-5 h-5" />,
    },
    {
      title: "API Management",
      href: "/dashboard/api-management",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (url: string) => {
    return pathname === url;
  };

  const handleSignOut = async () => {
    // Add your sign out logic here
    console.log("Signing out...");
  };

  if (!mounted || !session) return null;

  const user = session.user;
  const userInitials = (user.name || user.email?.split("@")[0] || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const name = user.name || "User";
  const userEmail = user.email || "";
  // const userGithub = session.user?.github || "";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-[15.5px]">
        <div className="flex items-center  ">
          <img src="/fox1.svg" alt="Fox logo" className="w-8 h-8 shrink-0" />
          {open && <span className="text-2xl pl-3 font-bold">CodeFox</span>}
        </div>
      </SidebarHeader>

      <div className="pr-2">
        <SidebarSeparator />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          <TooltipProvider delayDuration={0}>
            {navigations.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  className="
              w-full
              bg-transparent
              hover:bg-transparent
              active:bg-transparent
              border border-transparent
              active:border-transparent
              data-[active=true]:border-border
              focus-visible:ring-0
              focus-visible:outline-none
            "
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </TooltipProvider>
        </SidebarMenu>
      </SidebarContent>
       <div className="pr-2">
        <SidebarSeparator />
      </div>


      <SidebarFooter className="p-4">
  <DropdownMenu>
    <DropdownMenuTrigger
      className="
        w-full
        focus:outline-none
        focus-visible:outline-none
        focus-visible:ring-0
      "
    >
      {open ? (
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarImage src={user.image || undefined} alt={name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>

          {/* IMPORTANT: min-w-0 for truncate */}
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-sm font-medium truncate max-w-full">
              {name}
            </span>

            {/* 👇 Tooltip ONLY on email */}
            <TooltipProvider delayDuration={500}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-muted-foreground truncate max-w-full cursor-default">
                    {userEmail}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs break-all">
                  {userEmail}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Avatar className="w-9 h-9">
            <AvatarImage src={user.image || undefined} alt={name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuItem
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Toggle theme
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleSignOut}>
        <Logout>Sign Out</Logout>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</SidebarFooter>

    </Sidebar>
  );
};

export default AppSidebar;
