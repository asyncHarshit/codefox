"use client";
import React, { useState } from 'react';
import { Github , Loader } from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { redirect } from 'next/navigation';


const LoginUi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider : "github",
        callbackURL : "/dashboard"
      })
      console.log("Login successful");
      
    } catch (error) {
      console.error("Github login error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/fox.png" 
            alt="Fox Logo" 
            className="w-full h-full object-cover opacity-20 blur-sm scale-110"
          />
        </div>
        <div className="absolute inset-0  from-card/95 via-card/80 to-card/60" />
        
        <div className="max-w-lg relative z-10 space-y-8">
          <div>
            <h1 className="text-7xl font-bold text-foreground mb-3 tracking-tight leading-none">
              CodeFox
            </h1>
            <div className="h-1 w-24 bg-primary rounded-full" />
          </div>
          
          <p className="text-2xl text-foreground/80 font-light leading-relaxed">
            AI-powered code reviewer
          </p>
          
          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 group-hover:scale-150 transition-transform" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                Intelligent code analysis and suggestions
              </p>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 group-hover:scale-150 transition-transform" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with your GitHub repositories
              </p>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 group-hover:scale-150 transition-transform" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                Real-time collaboration with AI
              </p>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 group-hover:scale-150 transition-transform" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                Seamless GitHub integration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="text-5xl font-bold text-foreground mb-3 tracking-tight">
              codeFox
            </h1>
            <p className="text-base text-muted-foreground">
              AI-powered code reviewer
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-card border border-border rounded-2xl p-10 shadow-2xl">
            <div className="mb-10">
              <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
                Welcome back
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Sign in to continue to codeFox
              </p>
            </div>

            {/* GitHub Button */}
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span className="text-base">Connecting...</span>
                </>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  <span className="text-base">Continue with GitHub</span>
                </>
              )}
            </button>

            <p className="text-sm text-muted-foreground/70 text-center mt-8 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUi;