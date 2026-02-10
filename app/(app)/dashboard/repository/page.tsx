"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Star, Search, AlertCircle, Loader2 } from "lucide-react";
import { useRepositories } from "@/module/repository/hooks/use-repository";
import { useConnectRepository } from "@/module/repository/hooks/use-connect-repo";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  isConnected?: boolean;
}

const RepositoryPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();
  const [searchQuery, setSearchQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);

  const { mutate: connectRepo } = useConnectRepository();

  const allRepositories = data?.pages.flatMap((page) => page) || [];

  function RepoCardShimmer() {
    return (
      <div className="rounded-xl border border-border/40 p-6 flex justify-between items-center">
        {/* Left content */}
        <div className="space-y-3 w-full max-w-lg">
          <div className="h-5 w-40 shimmer rounded" />
          <div className="h-4 w-64 shimmer rounded" />
          <div className="h-3 w-32 shimmer rounded" />
          <div className="h-3 w-12 shimmer rounded" />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-6">
          <div className="h-9 w-28 shimmer rounded-lg" />
          <div className="h-9 w-28 shimmer rounded-lg" />
        </div>
      </div>
    );
  }

  // Filter repositories based on search query
  const filteredRepositories = allRepositories.filter((repo) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      repo.name.toLowerCase().includes(query) ||
      repo.description?.toLowerCase().includes(query) ||
      repo.topics?.some((topic: string) => topic.toLowerCase().includes(query))
    );
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleConnect = (repo: Repository) => {
    if (repo.isConnected) return;

    connectRepo({
      owner: repo.full_name.split("/")[0],
      repo: repo.name,
      githubId: repo.id,
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-background via-background to-muted/20">

      {/* Header Section */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-6 overflow-x-hidden">

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-6 min-w-0">

              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Repositories
                </h1>
                <p className="text-muted-foreground text-sm">
                  Discover and connect to your favorite repositories
                </p>
              </div>
              
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search repositories, topics, languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 min-h-[400px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <RepoCardShimmer key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md border-destructive/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <CardTitle>Error Loading Repositories</CardTitle>
                </div>
                <CardDescription>
                  There was an error fetching repositories. Please try again
                  later.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Repository List */}
        {!isLoading && !isError && (
          <>
            {filteredRepositories.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      No repositories found
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-3">
                {filteredRepositories.map((repo, index) => (
                  <Card
                    key={repo.id}
                    className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden"
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-6">
                        {/* Left side - Repository Info */}
                        <div className="flex-1 min-w-0 space-y-2">

                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">

                              <div className="flex items-center gap-2">
                                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                                  {repo.name}
                                </CardTitle>
                                <Badge
                                  variant={
                                    repo.isConnected ? "default" : "outline"
                                  }
                                  className="shrink-0"
                                >
                                  {repo.isConnected ? "Connected" : "Available"}
                                </Badge>
                              </div>
                              <CardDescription className="text-sm mt-1">
                                {repo.full_name}
                              </CardDescription>
                            </div>
                          </div>

                          {/* Description */}
                          {repo.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {repo.description}
                            </p>
                          )}

                          {/* Meta Information */}
                          <div className="flex items-center gap-6 text-sm">
                            {repo.language && (
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: getLanguageColor(
                                      repo.language,
                                    ),
                                  }}
                                />
                                <span className="text-muted-foreground font-medium">
                                  {repo.language}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="font-medium">
                                {formatStarCount(repo.stargazers_count)}
                              </span>
                            </div>
                          </div>

                          {/* Topics */}
                          {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {repo.topics.slice(0, 5).map((topic: string) => (
                                <Badge
                                  key={topic}
                                  variant="secondary"
                                  className="text-xs px-2.5 py-0.5"
                                >
                                  {topic}
                                </Badge>
                              ))}
                              {repo.topics.length > 5 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2.5 py-0.5"
                                >
                                  +{repo.topics.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right side - Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            onClick={() => handleConnect(repo)}
                            disabled={repo.isConnected}
                            variant={repo.isConnected ? "outline" : "default"}
                            size="sm"
                            className="min-w-[120px]"
                          >
                            {repo.isConnected ? "Connected" : "Connect"}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(repo.html_url, "_blank")}
                            className="min-w-[120px]"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Repo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="py-4">
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
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
};

// Helper function to format star count
const formatStarCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

// Helper function to get language color
const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Vue: "#41b883",
    Svelte: "#ff3e00",
  };
  return colors[language] || "#8b8b8b";
};

export default RepositoryPage;
