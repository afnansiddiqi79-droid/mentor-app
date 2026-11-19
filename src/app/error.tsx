"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-destructive/10 blur-3xl" />
      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <Logo />
        <div className="mt-10 flex size-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          An unexpected error interrupted this page. You can try again, or head back
          home and continue browsing.
        </p>
        {error.digest ? (
          <p className="mt-3 rounded-md bg-muted px-3 py-1.5 font-mono text-[0.7rem] text-muted-foreground">
            Error reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            <RotateCcw className="size-4" /> Try again
          </Button>
          <Button render={<Link href="/" />} variant="outline" size="lg">
            <Home className="size-4" /> Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
