import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
    role: z.enum(["student", "tutor"]),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const applicationSchema = z.object({
  phone: z.string().trim().min(6, "Enter a valid phone number").max(24),
  preferredSchedule: z
    .string()
    .trim()
    .min(3, "Tell the tutor when you are available")
    .max(160),
  studentNote: z.string().trim().max(1000, "Note must be under 1000 characters"),
});

export const tuitionSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(140),
  subject: z.string().trim().min(2, "Subject is required").max(60),
  classLevel: z.string().trim().min(1, "Class level is required").max(60),
  mode: z.enum(["Online", "Offline"]),
  location: z.string().trim().min(2, "Location is required").max(160),
  monthlyFee: z.coerce
    .number({ error: "Enter a valid fee" })
    .min(0, "Fee cannot be negative")
    .max(1_000_000),
  daysPerWeek: z.coerce
    .number({ error: "Enter days per week" })
    .int("Use a whole number")
    .min(1, "At least 1 day")
    .max(7, "At most 7 days"),
  bannerImage: z.string().trim().url("Upload a banner image first"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(4000),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  phone: z.string().trim().max(24, "Phone number is too long"),
  bio: z.string().trim().max(600, "Bio must be under 600 characters"),
  image: z.string().trim().url("Upload a profile photo").or(z.literal("")),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type ApplicationValues = z.infer<typeof applicationSchema>;
export type TuitionValues = z.infer<typeof tuitionSchema>;
export type TuitionFormValues = z.input<typeof tuitionSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
