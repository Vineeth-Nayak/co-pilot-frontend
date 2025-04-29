import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewspaperIcon, UserIcon, TagIcon, ChartBarIcon, CogIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const navItems = [
  { name: "Dashboard", href: "/cms", icon: ChartBarIcon },
  { name: "Articles", href: "/cms/articles", icon: NewspaperIcon },
  // { name: "Drafts", href: "/cms/drafts", icon: DocumentTextIcon },
  { name: "Authors", href: "/cms/authors", icon: UserIcon },
  { name: "Categories", href: "/cms/categories", icon: TagIcon },
  // { name: "Settings", href: "/cms/settings", icon: CogIcon },
];

export default function CmsNav() {
  const pathname = usePathname();

  return (
    <nav className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-bold text-gray-800">Content Manager</div>
        <div className="text-xs text-gray-500">Admin Dashboard</div>
      </div>

      <ul className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => (
          <li key={name}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                pathname === href ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className={`w-5 h-5 ${pathname === href ? "text-blue-600" : "text-gray-500"}`} />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
