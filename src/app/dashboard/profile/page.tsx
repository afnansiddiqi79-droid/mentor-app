"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  Camera,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { useAuth } from "@/components/auth-provider";
import { FormField } from "@/components/form-field";
import { PageHeader } from "@/components/dashboard/page-header";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { api, ApiClientError, uploadImage } from "@/lib/api";
import { profileSchema, type ProfileValues } from "@/lib/validations";
import { roleLabel } from "@/lib/format";
import type { AppUser } from "@/lib/types";

function ProfileContent() {
  const { user, refetch } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(user?.image || "");
  const [progress, setProgress] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      image: user?.image || "",
    },
  });

  async function handleAvatar(file: File | undefined) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large", { description: "Maximum size is 5 MB." });
      return;
    }
    setProgress(0);
    try {
      const result = await uploadImage(file, setProgress);
      setAvatar(result.url);
      setValue("image", result.url, { shouldValidate: true });
      toast.success("Photo uploaded — remember to save");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : "Upload failed";
      toast.error("Could not upload photo", { description: message });
    } finally {
      setProgress(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function onSubmit(values: ProfileValues) {
    try {
      const updated = await api.patch<AppUser>("/api/profile/me", values);
      setAvatar(updated.image || "");
      await refetch();
      toast.success("Profile updated");
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : "Could not update your profile.";
      toast.error("Update failed", { description: message });
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Update profile"
        description="Keep your details current so students and tutors can reach you."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="flex flex-col items-center gap-4 rounded-xl border bg-muted/30 p-5 sm:flex-row">
                <UserAvatar name={user.name} image={avatar} className="size-20 text-xl" />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <p className="text-sm font-semibold">Profile photo</p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP or GIF up to 5 MB.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInput.current?.click()}
                      disabled={progress !== null}
                    >
                      {progress !== null ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Camera className="size-4" />
                      )}
                      Upload photo
                    </Button>
                    {avatar ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatar("");
                          setValue("image", "", { shouldValidate: true });
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(event) => void handleAvatar(event.target.files?.[0])}
                  />
                  {progress !== null ? <Progress value={progress} /> : null}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Full name" htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
                </FormField>
                <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" placeholder="+880 17XX XXXXXX" {...register("phone")} />
                </FormField>
              </div>

              <FormField label="Email address" htmlFor="email" hint="Email changes are handled by account support.">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" value={user.email} disabled className="pl-9" />
                </div>
              </FormField>

              <FormField
                label="Short bio"
                htmlFor="bio"
                error={errors.bio?.message}
                hint="A short introduction shown to other users."
              >
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell students or tutors a little about yourself…"
                  {...register("bio")}
                />
              </FormField>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting || progress !== null}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="secondary" className="capitalize">
                  {roleLabel(user.role)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan</span>
                <Badge
                  variant="outline"
                  className={
                    user.role !== "admin" && user.plan === "pro"
                      ? "border-primary/30 text-primary capitalize"
                      : "capitalize"
                  }
                >
                  {user.role === "admin" ? "N/A" : user.plan}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <BadgeCheck className="size-3.5" /> Verified
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {user.role === "admin" || user.plan === "pro" ? (
                  <Sparkles className="size-4 text-primary" />
                ) : (
                  <ShieldCheck className="size-4 text-primary" />
                )}
                {user.role === "admin"
                  ? "Administrator access"
                  : user.plan === "pro"
                    ? "Pro plan active"
                    : "Free plan"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {user.role === "admin"
                  ? "You have full access to moderation, user roles and payment reporting."
                  : user.plan === "pro"
                    ? "You have unlimited access to MentorLagbe features."
                    : user.role === "tutor"
                      ? "Upgrade to post unlimited tuitions and stand out to students."
                      : "Upgrade for priority application support and a Pro badge."}
              </p>
              {user.role !== "admin" && user.plan !== "pro" ? (
                <Button render={<Link href="/pricing" />} className="w-full" size="sm">
                  <UserRound className="size-4" /> Upgrade to Pro
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RoleGuard>
      <ProfileContent />
    </RoleGuard>
  );
}
