"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  getConnectedRepos,
  disconnectRepositories,
  disconnectAllRepository,
} from "@/module/settings/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ExternalLink, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Repository = {
  id: string;
  name: string;
  fullName: string;
  url: string;
  createdAt: Date;
};

/* ================= Profile Form Component ================= */
function ProfileForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUserProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return await updateUserProfile(data);
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({
          queryKey: ["user-profile"],
        });
        toast.success("Profile updated successfully");
      }
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ name, email });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="space-y-3 pb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary-foreground"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Profile Settings
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Update your personal information
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="h-11 border-2 focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="h-11 border-2 focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 h-11 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {updateMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName(profile?.name || "");
                setEmail(profile?.email || "");
              }}
              className="h-11 border-2 font-semibold"
              disabled={updateMutation.isPending}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ================= Repository List Component ================= */
function RepositoryList() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["repositories"],
    queryFn: getConnectedRepos,
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectRepositories,
    onSuccess: () => {
      toast.success("Repository disconnected");
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
    onError: () => {
      toast.error("Failed to disconnect repository");
    },
  });

  const disconnectAllMutation = useMutation({
    mutationFn: disconnectAllRepository,
    onSuccess: () => {
      toast.success("All repositories disconnected");
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
    },
    onError: () => {
      toast.error("Failed to disconnect repositories");
    },
  });

  if (isLoading) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              Loading repositories...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card className="border-2 shadow-lg">
        <CardContent className="p-12">
          <p className="text-center text-muted-foreground">
            No repositories connected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Connected Repositories
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Manage your GitHub repositories
              </CardDescription>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-9">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Disconnect All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will disconnect all repositories permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => disconnectAllMutation.mutate()}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Disconnect all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.map((repo: Repository) => (
          <Card key={repo.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{repo.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {repo.fullName}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  GitHub
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(repo.url, "_blank")}
                  className="flex-1 h-9 border-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Repository
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="h-9">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disconnect {repo.name}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => disconnectMutation.mutate(repo.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

/* ================= Main Settings Page ================= */
export default function SettingsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <ProfileForm />
      <RepositoryList />
    </div>
  );
}