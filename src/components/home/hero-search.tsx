"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        router.push(query ? `/tuitions?search=${encodeURIComponent(query)}` : "/tuitions");
      }}
      className="flex w-full max-w-xl flex-col gap-2 rounded-xl border bg-card/90 p-2 shadow-lg shadow-primary/5 backdrop-blur sm:flex-row sm:items-center"
      role="search"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Try “HSC Physics”, “IELTS”, or “Python”"
          aria-label="Search tuitions"
          className="h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      <Button type="submit" size="lg" className="h-11 shrink-0 px-5">
        Browse Tuitions
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
