"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (oauthError) {
      setError(oauthError.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-2xl shadow-black/5">
          <CardHeader className="space-y-4 p-0">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Welcome back</p>
              <CardTitle className="mt-2 text-3xl font-semibold">Login to StudyFlow</CardTitle>
            </div>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <span>Enter your credentials to continue to the student productivity dashboard.</span>
            </div>
          </CardHeader>
          <CardContent className="mt-6 p-0">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hello@studyflow.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <label className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-3 py-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-border bg-background text-primary" />
                  Remember me
                </label>
                <span>Secure session only</span>
              </div>
              <Button type="submit" className="rounded-full px-6 py-3 text-sm font-semibold">Login</Button>
              <Button type="button" variant="outline" className="rounded-full px-6 py-3 text-sm font-semibold" onClick={handleGoogle}>
                <LogIn className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
            <p>
              New to StudyFlow? <Link href="/register" className="text-primary hover:underline">Create an account</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
