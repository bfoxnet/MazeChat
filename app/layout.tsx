import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Aura Chat - Intelligent AI Workspace',
  description: 'An advanced, responsive AI chatbot workspace featuring multi-model orchestration, reasoning traces, live tool calls, web citations, and contextual memory.',
  openGraph: {
    title: 'Aura Chat - Intelligent AI Workspace',
    description: 'An advanced, responsive AI chatbot workspace featuring multi-model orchestration, reasoning traces, live tool calls, web citations, and contextual memory.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura Chat - Intelligent AI Workspace',
    description: 'An advanced, responsive AI chatbot workspace featuring multi-model orchestration, reasoning traces, live tool calls, web citations, and contextual memory.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full", "dark", "font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        {/* KaTeX CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full antialiased font-sans bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-400 transition-colors duration-200" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
