"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    
    // Simulate network request and auth
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Store auth state in localStorage
      localStorage.setItem("userLoggedIn", "true");
      
      // Redirect to dashboard after brief success animation
      setTimeout(() => {
        router.push("/");
      }, 800);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f6fafe] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center space-y-6 animate-in zoom-in duration-300">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl rotate-6" />
            <div className="absolute inset-0 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold font-manrope text-[#171c1f]">Welcome Back!</h2>
            <p className="text-muted-foreground font-medium">Entering your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fafe] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" />

      <div className="w-full max-w-sm z-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 bg-white rounded-2xl shadow-ambient items-center justify-center mb-2 border border-white">
            <div className="h-8 w-8 bg-primary rounded-xl rotate-12 flex items-center justify-center">
              <span className="text-white font-black text-xl -rotate-12">Q</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold font-manrope tracking-tight text-[#171c1f]">
            Queen <span className="text-primary italic">Laundry</span>
          </h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Micro-SaaS Management
          </p>
        </div>

        <Card className="border-none shadow-ambient rounded-[2rem] bg-white/70 backdrop-blur-2xl overflow-hidden glassmorphism">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Email / Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-14 rounded-2xl border-gray-100 bg-white/50 pl-12 font-bold text-[#171c1f] focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl border-gray-100 bg-white/50 pl-12 font-bold text-[#171c1f] focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-mono tracking-widest"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          Authorized Operator Only
        </p>
      </div>
    </div>
  );
}
