import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import { MainInterfaceMusicController } from "@/components/MainInterfaceMusicController";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "The Last Answer: Ashes of The First Monolith",
  description: "A web-based quiz RPG with persistent player progress.",
  icons: {
    icon: [
      { url: "/branding/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/branding/logo-option2-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${cinzel.variable} min-h-full flex flex-col`}>
        <MainInterfaceMusicController />
        <section className="flex min-h-screen items-center justify-center bg-black p-4">
          <div
            className="relative aspect-video w-full overflow-hidden bg-black shadow-2xl"
            style={{
              maxWidth:
                "min(calc(100vw - 2rem), calc((100vh - 2rem) * 16 / 9))",
            }}
          >
            <div className="h-full w-full">{children}</div>
          </div>
        </section>
      </body>
    </html>
  );
}
