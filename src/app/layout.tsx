import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { THEME_COOKIE, THEME_INIT_SCRIPT, isTheme } from "@/lib/theme";

import "./globals.css";

// The variable name has to be `--font-sans`, which is what globals.css maps
// into Tailwind's font-sans. It used to be `--font-geist-sans`, which nothing
// read — so this app has been rendering in the browser's default serif.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timer · SteveTech",
  description: "Track time against what you're working on.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The same cookie the host writes. Because every zone is served from the
  // host's origin, switching to dark on the dashboard means this app is already
  // dark on arrival — no flash, and no per-app preference to keep in step.
  const theme = (await cookies()).get(THEME_COOKIE)?.value;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${
        isTheme(theme) && theme === "dark" ? "dark" : ""
      }`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
          id="theme-init"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
