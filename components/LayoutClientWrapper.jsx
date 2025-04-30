// components/LayoutClientWrapper.jsx
"use client";
import { usePathname } from "next/navigation";
import CommonNavbar from "@/components/Common/CommonNavbar";
import CommonFooter from "@/components/Common/CommonFooter";

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const isCmsRoute = pathname.startsWith("/cms");

  return (
    <>
      {!isCmsRoute && <CommonNavbar />}
      {children}
      {!isCmsRoute && <CommonFooter />}
    </>
  );
}
