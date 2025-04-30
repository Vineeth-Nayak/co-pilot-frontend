// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Vineeth's News Platform",
  description: "Welcome to the CMS of Vineeth's News Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
