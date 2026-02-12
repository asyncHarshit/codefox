"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Bot, Zap, Github, BarChart3, Target, Lock } from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    dashboard: false,
    features: false,
    review: false,
    diagram: false,
    contact: false,
  });
  const [isScrolled, setIsScrolled] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setIsVisible((prev) => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".animate-section");
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-foreground overflow-x-hidden">
      {/* Transparent Navbar */}
      <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
  bg-black/80 backdrop-blur border-b
  ${isScrolled ? "border-white/10" : "border-transparent"}`}
>

        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
              <Image
                src="/fox1.svg"
                alt="Fox"
                fill
                className="object-contain"
              />
            </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                CodeFox
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#review"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Reviews
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                className="hidden md:inline-flex text-muted-foreground hover:text-primary"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Background Grid */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[linear-linear(to_right,#4f4f4f2e_1px,transparent_1px),linear-linear(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[4rem_4rem] [mask-image:radial-linear(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        className="animate-section min-h-screen flex items-center justify-center px-6 py-20 pt-32 relative"
      >
        <div
          className={`max-w-5xl text-center space-y-8 transition-all duration-1000 ${
            isVisible.hero
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo Animation */}
          
          

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-linear leading-tight">
            CodeFox
          </h1>

          <p className="text-xl md:text-3xl font-light text-muted-foreground max-w-3xl mx-auto">
            AI-Powered Code Review That Actually Works
          </p>

          <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Automatically review pull requests, catch bugs, and improve code
            quality before humans waste time. Connect your repositories and let
            AI do the heavy lifting.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(114,185,82,0.5)]"
            >
              <Link href="/login">
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg bg-amber-50 rounded-xl border-2 hover:bg-accent transition-all hover:scale-105"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
            {[
              { label: "Pull Requests Reviewed", value: "10K+" },
              { label: "Bugs Caught", value: "50K+" },
              { label: "Time Saved", value: "5000h" },
              { label: "Repositories", value: "1K+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        id="dashboard"
        className="animate-section py-20 px-6 bg-linear-to-b from-black via-black/95 to-black"
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible.dashboard
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              Your Command Center
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your development activity and contributions in real-time
            </p>
          </div>

          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-linear-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl hover:shadow-[0_0_80px_rgba(114,185,82,0.3)] transition-all duration-500">
              <Image
                src="/dashboard.png"
                alt="CodeFox Dashboard showing repository stats and contribution graph"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="animate-section py-20 px-6 bg-black"
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible.features
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-secondary to-primary">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for automated code reviews
            </p>
          </div>


<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {[
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning models analyze your code for bugs, vulnerabilities, and best practices violations.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get reviews in seconds, not hours. Our optimized pipeline processes pull requests instantly.",
    },
    {
      icon: Github,
      title: "GitHub Integration",
      description:
        "Seamlessly connect your repositories. Reviews appear directly on your pull requests.",
    },
    {
      icon: BarChart3,
      title: "Detailed Insights",
      description:
        "Comprehensive dashboards showing your code quality metrics, trends, and improvements over time.",
    },
    {
      icon: Target,
      title: "Smart Suggestions",
      description:
        "Not just problems - get actionable suggestions and code snippets to fix issues immediately.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your code stays safe. We use industry-standard encryption and never store your source code.",
    },
  ].map((feature, idx) => (
    <div
      key={idx}
      className="group p-8 rounded-2xl bg-white/5 border-2 border-white/10 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(114,185,82,0.2)]"
      style={{
        animationDelay: `${idx * 100}ms`,
      }}
    >
      <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
        <feature.icon className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* AI Review Preview */}
      <section
        id="review"
        className="animate-section py-20 px-6 bg-linear-to-b from-black via-black/95 to-black"
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible.review
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              Intelligent Code Reviews
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how AI analyzes your code changes with detailed explanations
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-r from-secondary/30 via-primary/30 to-secondary/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl hover:shadow-[0_0_80px_rgba(82,155,185,0.3)] transition-all duration-500">
              <Image
                src="/review.png"
                alt="CodeFox AI Review showing detailed code analysis and suggestions"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Diagram */}
      <section
        id="diagram"
        className="animate-section py-20 px-6 bg-black"
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible.diagram
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-secondary to-primary">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple integration, powerful automation
            </p>
          </div>

          <div className="relative group mb-16">
            <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl hover:shadow-[0_0_80px_rgba(114,185,82,0.3)] transition-all duration-500">
              <Image
                src="/diagram.png"
                alt="CodeFox architecture diagram showing the review workflow"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {[
              {
                step: "01",
                title: "Connect Repository",
                description: "Link your GitHub repository with one click",
              },
              {
                step: "02",
                title: "Create Pull Request",
                description: "Make changes and open a PR as usual",
              },
              {
                step: "03",
                title: "AI Analysis",
                description: "CodeFox automatically reviews your code",
              },
              {
                step: "04",
                title: "Get Feedback",
                description: "Receive detailed comments and suggestions",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-6xl font-bold text-primary/20 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="animate-section py-20 px-6 bg-linear-to-b from-black to-black/95"
      >
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-600 ${
            isVisible.contact
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers improving their code quality with AI
            </p>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 md:p-12 border-2 border-white/10 shadow-2xl backdrop-blur-sm">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-white/10 focus:border-primary outline-none transition-all text-white placeholder:text-muted-foreground"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-white/10 focus:border-primary outline-none transition-all text-white placeholder:text-muted-foreground"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  GitHub Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-white/10 focus:border-primary outline-none transition-all text-white placeholder:text-muted-foreground"
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-white/10 focus:border-primary outline-none transition-all resize-none text-white placeholder:text-muted-foreground"
                  placeholder="Tell us about your project..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(114,185,82,0.5)]"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-12">
            {["GitHub", "Twitter", "Discord", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary hover:bg-white/10 transition-all hover:scale-110"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl"></div>
                <span className="text-xl font-bold text-primary">CodeFox</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered code reviews for modern development teams
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
            <p>© 2026 CodeFox. Built for developers who care about code quality.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes linear {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-linear {
          animation: linear 6s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}