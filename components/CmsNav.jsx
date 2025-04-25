import Link from "next/link";

export default function CmsNav() {
  return (
    <nav className="p-4 bg-gray-100 h-full">
      <ul className="space-y-2">
        <li>
          <Link href="/cms/articles">Articles</Link>
        </li>
        <li>
          <Link href="/cms/authors">Authors</Link>
        </li>
        <li>
          <Link href="/cms/categories">Categories</Link>
        </li>
      </ul>
    </nav>
  );
}
