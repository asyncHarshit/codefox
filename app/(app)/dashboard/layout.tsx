"use server";

import { Suspense } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { db } from "@/lib/db";

/* ================= Sidebar Skeleton ================= */
function SidebarSkeleton() {
  return (
    <div className="h-screen w-64 border-r bg-background p-4 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded" />
      <div className="h-8 bg-muted rounded" />
      <div className="h-8 bg-muted rounded" />
      <div className="h-8 bg-muted rounded" />
    </div>
  );
}

/* ================= Dashboard Skeleton ================= */
function ContentSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded" />
    </div>
  );
}

/* ================= DB FETCH ================= */
async function getRepositoryOwner() {
  const repo = await db.repository.findFirst({
    select: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return repo?.owner ?? "Unknown";
}

/* ================= Layout ================= */
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const repoOwner = await getRepositoryOwner();

  return (
    <SidebarProvider>
      {/* Sidebar renders first */}
      <Suspense fallback={<SidebarSkeleton />}>
        <AppSidebar />
      </Suspense>

      <SidebarInset className="overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />

          <h1 className="text-xl font-semibold flex items-center justify-between w-full">
            <span>Dashboard</span>
            <span className="text-muted-foreground font-normal px-2 py-0.5 border border-dotted border-white/30 rounded-md inline-flex items-center gap-1.5">
              {repoOwner}
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            </span>
          </h1>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Suspense fallback={<ContentSkeleton />}>{children}</Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
