// components/CmsNav.jsx
import Link from "next/link";
import { NewspaperIcon, UserIcon, TagIcon } from "@heroicons/react/24/outline";

const navItems = [
  { name: "Articles", href: "/cms/articles", icon: NewspaperIcon },
  { name: "Authors", href: "/cms/authors", icon: UserIcon },
  { name: "Categories", href: "/cms/categories", icon: TagIcon },
];

export default function CmsNav() {
  return (
    <nav className="h-full bg-white border-r border-gray-200 p-4">
      <div className="mb-6 text-xl font-semibold text-gray-800">CMS</div>
      <ul className="space-y-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <li key={name}>
            <Link
              href={href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon className="w-5 h-5 text-gray-500" />
              <span>{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
