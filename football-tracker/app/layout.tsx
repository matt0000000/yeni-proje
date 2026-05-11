import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CurrencyProvider } from "@/lib/currency-context";
import { ThemeProvider } from "@/lib/theme-context";

export const metadata: Metadata = {
  title: { default: "TransferScope — Football Market Values", template: "%s | TransferScope" },
  description: "Track football player market values across Premier League, La Liga, Bundesliga, Serie A, Ligue 1, and Süper Lig.",
  keywords: ["football", "transfer values", "market value", "transfermarkt", "premier league"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-primary)] antialiased">
        <ThemeProvider>
          <CurrencyProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
            <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 py-8 text-center text-xs text-slate-400">
              <p>TransferScope · Market values sourced from public data · Not affiliated with Transfermarkt</p>
              <p className="mt-1">Data refreshed weekly · All values in EUR unless converted</p>
            </footer>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
