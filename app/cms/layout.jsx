import CmsNav from "@/components/CmsNav";

export const metadata = { title: "CMS" };
export default function CmsLayout({ children }) {
  return (
    <div className="flex">
      <aside className="w-1/6">
        <CmsNav />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
