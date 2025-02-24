import { Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const sans = Inter({ variable: '--font-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
