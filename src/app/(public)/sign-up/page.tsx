import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthAside } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Create Account" };

export default function SignUpPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <AuthAside />
        <Card className="h-fit">
          <CardHeader className="space-y-1">
            <p className="eyebrow">Join MentorLagbe</p>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose your role, then set up your profile in seconds.
            </p>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
