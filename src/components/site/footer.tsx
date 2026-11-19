import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

function LinkedinLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.53-2.28 3.1V21h-4V9Z" />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3h-3v-2c0-.55.45-1 1-1Z" />
    </svg>
  );
}

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sign-up", label: "Become a Tutor" },
];

const socials = [
  { href: "https://x.com", label: "X (Twitter)", icon: XLogo },
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedinLogo },
  { href: "https://facebook.com", label: "Facebook", icon: FacebookLogo },
  { href: "https://github.com", label: "GitHub", icon: GithubLogo },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo inverse />
          <p className="max-w-xs text-sm leading-relaxed text-slate-300">
            A modern tuition and mentorship marketplace built to connect
            ambitious students with trusted tutors across Bangladesh.
          </p>
          <div className="flex gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-300 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Account</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/sign-in" className="text-slate-300 hover:text-white">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="text-slate-300 hover:text-white">
                Create Account
              </Link>
            </li>
            <li>
              <Link href="/dashboard/profile" className="text-slate-300 hover:text-white">
                Update Profile
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-slate-300 hover:text-white">
                Upgrade to Pro
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 text-slate-400" />
              <a href="mailto:hello@mentorlagbe.com" className="hover:text-white">
                hello@mentorlagbe.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 text-slate-400" />
              <a href="tel:+8801700000000" className="hover:text-white">
                +880 1700 000000
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 text-slate-400" />
              <span>Dhanmondi, Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p>Built for learners who refuse to settle.</p>
        </div>
      </div>
    </footer>
  );
}
