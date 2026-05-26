import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
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
            <form className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hello@studyflow.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
              <Button className="rounded-full px-6 py-3 text-sm font-semibold">Create Account</Button>
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
