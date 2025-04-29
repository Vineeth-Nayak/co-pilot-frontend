import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Vineeth News CMS" };

export default function CmsLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
      <Footer />
    </div>
  );
}
