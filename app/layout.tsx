import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from './_components/Navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Forum App',
    description: 'Forum',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            suppressHydrationWarning>
            {/*Providers ska vara här*/}
            <body className={inter.className}>
                <Navigation />
                <main>
                    <Toaster />
                    {children}
                </main>
            </body>
        </html>
    );
}
