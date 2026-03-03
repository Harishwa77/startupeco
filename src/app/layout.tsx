import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EchelonAI | Startup Ecosystem Engine',
  description: 'Advanced AI Startup Accelerator, VC, and Market Analyst',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#15191F] text-foreground">{children}</body>
    </html>
  );
}