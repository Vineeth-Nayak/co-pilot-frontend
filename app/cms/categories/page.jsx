import Link from "next/link";
import { getCategories } from "@/lib/api";

export default async function CategoriesPage() {
  const res = await getCategories();
  const categories = res.data.categories;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Categories</h1>
        <Link href="/cms/categories/new">New Category</Link>
      </div>
      <ul className="mt-4 space-y-2">
        {categories.map((c) => (
          <li key={c.categoryId}>
            {c.categoryName} <Link href={`/cms/categories/${c.categoryId}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
