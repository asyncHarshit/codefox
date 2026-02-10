"use client"
import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Key,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Shield,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

const API_KEY_STORAGE_KEY = "gemini_api_key"

export default function ApiKeyPage() {
  const [apiKey, setApiKey] = useState("")
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Load API key from localStorage on mount
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (stored) {
      setSavedApiKey(stored)
      setApiKey(stored)
    }
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate async operation
    setTimeout(() => {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey)
      setSavedApiKey(apiKey)
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 500)
  }

  const handleDelete = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    setSavedApiKey(null)
    setApiKey("")
    setShowKey(false)
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••"
    return `${key.slice(0, 4)}${"•".repeat(key.length - 8)}${key.slice(-4)}`
  }

  const isKeyValid = apiKey.trim().length > 0
  const hasChanges = apiKey !== (savedApiKey || "")

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Configuration</h1>
        <p className="text-muted-foreground">
          Manage your Gemini API key for AI-powered code reviews
        </p>
      </div>

      {/* Privacy Notice */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Your API key is stored locally</p>
              <p className="text-xs text-muted-foreground">
                We store your API key in your browser's local storage only. It is never sent to or stored in our database. 
                Your key remains on your device and is only used for making API requests directly from your browser.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main API Key Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gemini API Key
              </CardTitle>
              <CardDescription className="mt-1.5">
                Enter your Google AI Studio API key to enable code review features
              </CardDescription>
            </div>
            {savedApiKey && (
              <Badge variant="default" className="shrink-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={!apiKey}
                >
                  
                </button>
              </div>
            </div>
            {savedApiKey && !showKey && apiKey && (
              <p className="text-xs text-muted-foreground font-mono">
                Saved: {maskApiKey(savedApiKey)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!isKeyValid || !hasChanges || isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save API Key
                </>
              )}
            </Button>

            {savedApiKey && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>API key saved successfully</span>
            </div>
          )}

          {/* Warning Message */}
          {!savedApiKey && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>No API key configured. Code review features will be disabled.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Get API Key */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">How to get your API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Visit Google AI Studio and sign in with your Google account</li>
            <li>Navigate to the API Keys section</li>
            <li>Click "Create API Key" to generate a new key</li>
            <li>Copy the key and paste it above</li>
          </ol>
          <Button variant="outline" size="sm" asChild className="w-full">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Get API Key from Google AI Studio
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}