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
    queryFn: async () => await getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  /* ================= Monthly Activity ================= */
  const { data: monthlyActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isLoadingActivity) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 rounded-full" />
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-lg font-semibold">Loading dashboard</p>
            <p className="text-sm text-muted-foreground">Fetching your activity data...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Repositories",
      value: stats?.totalRepos ?? 0,
      icon: GitCommit,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",

    },
    {
      title: "Pull Requests",
      value: 10,
      icon: GitPullRequest,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",

    },
    {
      title: "Reviews",
      value: stats?.totolreviews ?? 0,
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

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/10">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Enhanced Header with Activity Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                
              </div>
              <p className="text-muted-foreground text-lg">
                Track your development activity and contributions
              </p>
            </div>
            
          </div>
        </div>

        {/* Enhanced Stats Grid with Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={`relative overflow-hidden border hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 group hover:-translate-y-1`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0  from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl  group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Total count</p>
                    
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Contribution Graph */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Contribution Graph</CardTitle>
                <CardDescription className="text-base">
                  Your GitHub activity over the past year
                </CardDescription>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                <span className="text-xs font-medium text-muted-foreground">Last 365 days</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ContributionGraphClient />
          </CardContent>
        </Card>

        {/* Premium Monthly Activity Chart */}
        {/* Premium Monthly Activity Chart */}
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Monthly Activity</CardTitle>
                <CardDescription className="text-base">
                  Breakdown of commits, pull requests, and reviews by month
                </CardDescription>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium">Commits</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium">PRs</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">Reviews</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyActivity}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <defs>
                    {/* Clean gradients for bars */}
                    <linearGradient id="commitsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                    </linearGradient>
                    
                    <linearGradient id="prsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity={0.8} />
                    </linearGradient>
                    
                    <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.2}
                    vertical={false}
                  />
                  
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    fontWeight={500}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    tick={{ fill: "#9ca3af" }}
                  />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                      padding: "12px 16px",
                    }}
                    labelStyle={{
                      color: "hsl(var(--foreground))",
                      fontWeight: 600,
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                    itemStyle={{
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                      padding: "4px 0",
                      fontWeight: 500,
                    }}
                    cursor={{
                      fill: "hsl(var(--muted))",
                      opacity: 0.1,
                    }}
                  />
                  
                  <Legend
                    wrapperStyle={{
                      paddingTop: "24px",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                  
                  {/* Bars with clean styling */}
                  <Bar
                    dataKey="commits"
                    name="Commits"
                    fill="url(#commitsGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  
                  <Bar
                    dataKey="prs"
                    name="Pull Requests"
                    fill="url(#prsGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                    animationBegin={150}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  
                  <Bar
                    dataKey="reviews"
                    name="AI Reviews"
                    fill="url(#reviewsGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                    animationBegin={300}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;