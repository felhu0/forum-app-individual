import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./_components/authProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forum App",
  description: "Forum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
      <html lang="en" suppressHydrationWarning>
        {/*Providers ska vara här*/}
        <body className={inter.className}>
          <>
            <Toaster />
            {children}
          </>
        </body>
      </html>
    </AuthContextProvider>
  );
}
