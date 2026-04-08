import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CORCO - Platforma do korepetycji",
  description: "Ucz się efektywnie z CORCO. Korepetycje online z grywalizacją, personalizowanymi ćwiczeniami i kalendarzem zajęć.",
};

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const isClerkConfigured = clerkKey.startsWith("pk_");

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="pl">
      <body className={font.className}>
        <Toaster />
        <ExitModal />
        <HeartsModal />
        <PracticeModal />
        {children}
      </body>
    </html>
  );

  if (isClerkConfigured) {
    const { ClerkProvider } = await import("@clerk/nextjs");
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
