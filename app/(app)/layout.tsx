"use client";

import { Suspense } from "react";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { QueryProvider } from "@/components/provider/query-provider";
import { Toaster } from "sonner";

function AppLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AppLoading />}>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </Suspense>
  );
}
