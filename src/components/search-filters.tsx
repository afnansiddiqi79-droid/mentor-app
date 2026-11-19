"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TuitionFilterOptions } from "@/lib/types";

interface SearchFiltersProps {
  options: TuitionFilterOptions;
  initial: {
    search: string;
    subject: string;
    classLevel: string;
    mode: string;
  };
}

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 dark:bg-input/30";

export function SearchFilters({ options, initial }: SearchFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initial.search);
  const [subject, setSubject] = useState(initial.subject);
  const [classLevel, setClassLevel] = useState(initial.classLevel);
  const [mode, setMode] = useState(initial.mode);

  function applyFilters(event?: React.FormEvent) {
    event?.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (subject) params.set("subject", subject);
    if (classLevel) params.set("classLevel", classLevel);
    if (mode) params.set("mode", mode);
    startTransition(() => {
      router.push(`/tuitions${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function reset() {
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMode("");
    startTransition(() => router.push("/tuitions"));
  }

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-5"
      aria-label="Filter tuitions"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <SlidersHorizontal className="size-4 text-primary" />
        Find your fit
      </div>
      <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or subject…"
            className="h-10 pl-9"
            aria-label="Search tuitions"
          />
        </div>

        <select
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={selectClass}
          aria-label="Filter by subject"
        >
          <option value="">All subjects</option>
          {options.subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={classLevel}
          onChange={(event) => setClassLevel(event.target.value)}
          className={selectClass}
          aria-label="Filter by class level"
        >
          <option value="">All class levels</option>
          {options.classLevels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={mode}
          onChange={(event) => setMode(event.target.value)}
          className={selectClass}
          aria-label="Filter by mode"
        >
          <option value="">Any mode</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <div className="flex gap-2">
          <Button type="submit" size="lg" className="h-10 flex-1 md:flex-none" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-10"
            onClick={reset}
            aria-label="Reset filters"
            disabled={isPending}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
