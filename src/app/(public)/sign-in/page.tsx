import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthAside, SignInForm } from "@/components/auth/sign-in-form";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <AuthAside />
        <Card className="h-fit">
          <CardHeader className="space-y-1">
            <p className="eyebrow">Welcome back</p>
            <CardTitle className="text-2xl">Sign in to MentorLagbe</CardTitle>
            <p className="text-sm text-muted-foreground">
              Continue browsing, applying and managing your tuitions.
            </p>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-6 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
              Demo accounts (after running the seed):
              <br />
              Student — student@mentorlagbe.com / Password123!
              <br />
              Tutor — tutor@mentorlagbe.com / Password123!
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Admin accounts are created by the protected seed script.{" "}
              <Link href="/how-it-works" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
