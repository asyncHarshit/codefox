"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  GitBranch,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getMonthlyActivity,
} from "@/module/dashboard/actions/indes";
import ContributionGraphClient from "@/components/provider/github-graph";

export function Dashboard() {
  /* ================= Dashboard Stats ================= */
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    refetchOnWindowFocus: false,
  });

  /* ================= Monthly Activity ================= */
  const { data: monthlyActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: getMonthlyActivity,
    refetchOnWindowFocus: false,
  });

  // Debug: Log the data to see what's being returned
  React.useEffect(() => {
    if (monthlyActivity) {
      console.log("Monthly Activity Data:", monthlyActivity);
      console.log("Is Array:", Array.isArray(monthlyActivity));
    }
  }, [monthlyActivity]);

  function DashboardShimmer() {
  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 w-48 shimmer rounded" />
        <div className="h-4 w-96 shimmer rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/40 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 shimmer rounded" />
              <div className="h-5 w-5 shimmer rounded-full" />
            </div>

            <div className="h-8 w-20 shimmer rounded" />
            <div className="h-3 w-24 shimmer rounded" />
          </div>
        ))}
      </div>

      {/* Contribution Graph */}
      <div className="rounded-xl border border-border/40 p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-48 shimmer rounded" />
          <div className="h-4 w-72 shimmer rounded" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-53 gap-1 mt-4">
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-sm shimmer"
            />
          ))}
        </div>

        <div className="h-3 w-40 shimmer rounded mt-3" />
      </div>

      {/* Monthly Activity Chart */}
      <div className="rounded-xl border border-border/40 p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-40 shimmer rounded" />
          <div className="h-4 w-80 shimmer rounded" />
        </div>

        <div className="h-[300px] w-full shimmer rounded-lg" />
      </div>
    </div>
  )
}


  if (isLoading || isLoadingActivity) {
    return (
      <DashboardShimmer/>
    );
  }

  const statCards = [
    {
      title: "Connected Repositories",
      value: stats?.totalRepos ?? 0,
      icon: GitCommit,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Pull Requests",
      value: stats?.totalPRs ?? 0,
      icon: GitPullRequest,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "AI Reviews",
      value: stats?.totalReviews ?? 0,
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Total Commits",
      value: stats?.totalCommits ?? 0,
      icon: GitBranch,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
  ];

  // Safely convert monthlyActivity to array
  let chartData: Array<{
    name: string;
    commits: number;
    prs: number;
    reviews: number;
  }> = [];

  if (monthlyActivity) {
    if (Array.isArray(monthlyActivity)) {
      chartData = monthlyActivity;
    } else if (typeof monthlyActivity === 'object') {
      // If it's an object, convert it to an array
      chartData = Object.entries(monthlyActivity).map(([name, values]: [string, any]) => ({
        name,
        commits: values?.commits ?? 0,
        prs: values?.prs ?? 0,
        reviews: values?.reviews ?? 0,
      }));
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Header with Activity Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your development activity and contributions
          </p>
        </div>
        <TrendingUp className="w-8 h-8 text-primary" />
      </div>

      {/* Enhanced Stats Grid with Animations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`relative overflow-hidden ${stat.borderColor} border-2 transition-all hover:shadow-lg`}
            >
              {/* Background Gradient Effect */}
              <div className={`absolute inset-0 ${stat.bgColor} opacity-50`} />

              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total count
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Contribution Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution Graph</CardTitle>
          <CardDescription>
            Your GitHub activity over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContributionGraphClient />
          <p className="text-xs text-muted-foreground mt-4">Last 365 days</p>
        </CardContent>
      </Card>

      {/* Premium Monthly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>
            Breakdown of commits, pull requests, and reviews by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              No monthly activity data available
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-sm"
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <YAxis
                    className="text-sm"
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />

                  {/* Clean gradients for bars */}
                  <defs>
                    <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="prsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>

                  {/* Bars with clean styling */}
                  <Bar
                    dataKey="commits"
                    fill="url(#commitsGradient)"
                    name="Commits"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="prs"
                    fill="url(#prsGradient)"
                    name="PRs"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="reviews"
                    fill="url(#reviewsGradient)"
                    name="Reviews"
                    radius={[8, 8, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;