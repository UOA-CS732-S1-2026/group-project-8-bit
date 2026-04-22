import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "The Oracle of Lost Knowledge",
  description: "A web-based quiz RPG with persistent player progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${cinzel.variable} min-h-full flex flex-col`}>
        <section className="flex min-h-screen items-center justify-center bg-black p-4">
          <div
            className="aspect-video w-full overflow-hidden bg-black shadow-2xl"
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
