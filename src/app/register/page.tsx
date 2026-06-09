"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase, supabaseUrl } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!supabaseUrl) {
      setError("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "Student Planner",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      // Network-level error (e.g. failed to reach Supabase)
      const message = err?.message ?? String(err);
      setError(`Registration failed: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-2xl shadow-black/5">
          <CardHeader className="space-y-4 p-0">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Create account</p>
              <CardTitle className="mt-2 text-3xl font-semibold">Register for StudyFlow</CardTitle>
            </div>
            <div className="grid gap-1 text-sm text-muted-foreground">
              <span>Set up a new planning workspace for study tasks, sessions, and notes.</span>
            </div>
          </CardHeader>
          <CardContent className="mt-6 p-0">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your full name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hello@studyflow.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>
              {error ? <p className="text-sm text-rose-500">{error}</p> : null}
              <Button type="submit" className="rounded-full px-6 py-3 text-sm font-semibold">Create Account</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-border/80 pt-6 text-sm text-muted-foreground">
            <p>
              Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
