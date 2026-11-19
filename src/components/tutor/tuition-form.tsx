"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { api, ApiClientError, uploadImage } from "@/lib/api";
import { tuitionSchema, type TuitionFormValues, type TuitionValues } from "@/lib/validations";
import type { Tuition } from "@/lib/types";

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 dark:bg-input/30";

interface TuitionFormProps {
  mode: "create" | "edit";
  initial?: Tuition;
  onSuccess: (tuition: Tuition) => void;
}

export function TuitionForm({ mode, initial, onSuccess }: TuitionFormProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [banner, setBanner] = useState(initial?.bannerImage || "");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TuitionFormValues, unknown, TuitionValues>({
    resolver: zodResolver(tuitionSchema),
    defaultValues: {
      title: initial?.title || "",
      subject: initial?.subject || "",
      classLevel: initial?.classLevel || "",
      mode: initial?.mode || "Online",
      location: initial?.location || "",
      monthlyFee: initial?.monthlyFee ?? 0,
      daysPerWeek: initial?.daysPerWeek ?? 2,
      bannerImage: initial?.bannerImage || "",
      description: initial?.description || "",
    },
  });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large", { description: "Maximum size is 5 MB." });
      return;
    }
    setUploadProgress(0);
    try {
      const result = await uploadImage(file, setUploadProgress);
      setBanner(result.url);
      setValue("bannerImage", result.url, { shouldValidate: true });
      toast.success("Banner uploaded");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : "Upload failed";
      toast.error("Could not upload image", { description: message });
    } finally {
      setUploadProgress(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function submit(values: TuitionValues) {
    try {
      const response =
        mode === "create"
          ? await api.post<Tuition>("/api/tutor/tuitions", values)
          : await api.patch<Tuition>(`/api/tutor/tuitions/${initial?.id}`, values);

      toast.success(
        mode === "create" ? "Tuition submitted for approval" : "Tuition updated"
      );
      onSuccess(response);
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : "Could not save the tuition.";
      toast.error("Save failed", { description: message });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Tuition title" htmlFor="title" required error={errors.title?.message} className="md:col-span-2">
          <Input id="title" placeholder="Higher Mathematics — Calculus & Algebra" aria-invalid={Boolean(errors.title)} {...register("title")} />
        </FormField>

        <FormField label="Subject" htmlFor="subject" required error={errors.subject?.message}>
          <Input id="subject" placeholder="Mathematics" aria-invalid={Boolean(errors.subject)} {...register("subject")} />
        </FormField>

        <FormField label="Class level" htmlFor="classLevel" required error={errors.classLevel?.message}>
          <Input id="classLevel" placeholder="Class 11-12" aria-invalid={Boolean(errors.classLevel)} {...register("classLevel")} />
        </FormField>

        <FormField label="Mode" htmlFor="mode" required error={errors.mode?.message}>
          <select id="mode" className={selectClass} {...register("mode")}>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </FormField>

        <FormField label="Location" htmlFor="location" required error={errors.location?.message}>
          <Input id="location" placeholder="Dhanmondi, Dhaka or Zoom" aria-invalid={Boolean(errors.location)} {...register("location")} />
        </FormField>

        <FormField label="Monthly fee (USD)" htmlFor="monthlyFee" required error={errors.monthlyFee?.message}>
          <Input id="monthlyFee" type="number" min={0} step={1} placeholder="4500" aria-invalid={Boolean(errors.monthlyFee)} {...register("monthlyFee")} />
        </FormField>

        <FormField label="Days per week" htmlFor="daysPerWeek" required error={errors.daysPerWeek?.message}>
          <Input id="daysPerWeek" type="number" min={1} max={7} step={1} aria-invalid={Boolean(errors.daysPerWeek)} {...register("daysPerWeek")} />
        </FormField>
      </div>

      <FormField
        label="Banner image"
        required
        error={errors.bannerImage?.message}
        hint="JPG, PNG, WebP or GIF up to 5 MB. Uploaded securely through ImgBB."
      >
        <input type="hidden" {...register("bannerImage")} />
        {banner ? (
          <div className="relative overflow-hidden rounded-xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={banner} alt="Tuition banner preview" className="aspect-[21/9] w-full object-cover" />
            <div className="absolute right-2 top-2 flex gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => fileInput.current?.click()}>
                Replace
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="destructive"
                aria-label="Remove banner"
                onClick={() => {
                  setBanner("");
                  setValue("bannerImage", "", { shouldValidate: true });
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-10 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <ImagePlus className="size-6 text-primary" />
            <span className="font-medium text-foreground">Upload a banner image</span>
            <span className="text-xs">A strong banner helps your tuition stand out.</span>
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        {uploadProgress !== null ? (
          <div className="space-y-1 pt-1">
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground">Uploading… {uploadProgress}%</p>
          </div>
        ) : null}
      </FormField>

      <FormField label="Description" htmlFor="description" required error={errors.description?.message}>
        <Textarea
          id="description"
          rows={6}
          placeholder="Describe the syllabus, teaching style, schedule and what students will receive…"
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </FormField>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting || uploadProgress !== null}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {mode === "create" ? "Submit for approval" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
