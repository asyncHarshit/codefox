"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getConnectedRepos, disconnectRepositories, disconnectAllRepository } from "../actions"
import { toast } from "sonner"
import { ExternalLink, Trash2, AlertTriangle } from "lucide-react"
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
} from "@/components/ui/alert-dialog"

type Repository = {
  id: string
  name: string
  fullName: string
  url: string
  createdAt: Date
}

export default function RepositoryList() {
  const queryClient = useQueryClient()

  // Fetch repositories
  const { data, isLoading } = useQuery({
    queryKey: ["repositories"],
    queryFn: getConnectedRepos,
  })

  // Disconnect single repo
  const disconnectMutation = useMutation({
    mutationFn: disconnectRepositories,
    onSuccess: () => {
      toast.success("Repository disconnected")
      queryClient.invalidateQueries({ queryKey: ["repositories"] })
    },
    onError: () => {
      toast.error("Failed to disconnect repository")
    },
  })

  // Disconnect all repos
  const disconnectAllMutation = useMutation({
    mutationFn: disconnectAllRepository,
    onSuccess: () => {
      toast.success("All repositories disconnected")
      queryClient.invalidateQueries({ queryKey: ["repositories"] })
    },
    onError: () => {
      toast.error("Failed to disconnect repositories")
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading repositories...</p>
        </CardContent>
      </Card>
    )
  }

  if (!data?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No repositories connected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Disconnect all button */}
      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
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

      {/* Repository list */}
      <div className="grid gap-4">
        {data.map((repo: Repository) => (
          <Card key={repo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{repo.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {repo.fullName}
                  </CardDescription>
                </div>
                <Badge variant="secondary">GitHub</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(repo.url, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
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
      </div>
    </div>
  )
}