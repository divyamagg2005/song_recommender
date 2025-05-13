
import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed as geist package is not installed
// import { GeistMono } from 'geist/font/mono'; // Removed as geist package is not installed
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// const geistSans = GeistSans; // Removed
// const geistMono = GeistMono; // Removed

export const metadata: Metadata = {
  title: 'StoryMuse',
  description: 'Generate song recommendations for your Instagram stories with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={'' /* Removed `${geistSans.variable} ${geistMono.variable}` */} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
