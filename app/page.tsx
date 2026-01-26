import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen  bg-black text-foreground flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-300">
            AI-Powered Code Reviewer
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground">
            Automatically review pull requests, catch bugs, and improve code
            quality before humans waste time.
          </p>

          <div className="flex justify-center gap-4 pt-4">
           <Button asChild>
              <Link href="/login">
             Login
              </Link>
            </Button>
                        
            <Button asChild>
              <Link href="/login">
                Get Started
              </Link>
            </Button>
                        
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-card border-t border-border px-6 py-16"
      >
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
          <Feature
            title="Smart Code Analysis"
            description="Detects bugs, bad patterns, and edge cases using AI trained on real-world code."
          />
          <Feature
            title="GitHub Integration"
            description="Connect repositories and get reviews directly on pull requests."
          />
          <Feature
            title="Actionable Feedback"
            description="Clear explanations and suggestions — not vague AI nonsense."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-6 border-t border-border">
        Built for developers who care about code quality.
      </footer>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}