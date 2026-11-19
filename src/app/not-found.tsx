import Link from "next/link";
import { ArrowLeft, Compass, SearchX } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <Logo />
        <div className="mt-10 flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <SearchX className="size-8" />
        </div>
        <p className="mt-6 font-heading text-6xl font-bold tracking-tight text-primary">
          404
        </p>
        <h1 className="mt-3 font-heading text-2xl font-semibold">
          This page took a different tuition
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page you are looking for may have moved, expired, or never existed.
          Let&apos;s get you back to finding the right mentor.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button render={<Link href="/" />} size="lg">
            <ArrowLeft className="size-4" /> Back home
          </Button>
          <Button render={<Link href="/tuitions" />} variant="outline" size="lg">
            <Compass className="size-4" /> Browse tuitions
          </Button>
        </div>
      </div>
    </main>
  );
}
