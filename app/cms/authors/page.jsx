import Link from "next/link";
import { getAuthors } from "@/lib/api";

export default async function AuthorsPage() {
  const res = await getAuthors();
  const authors = res.data.authors;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Authors</h1>
        <Link href="/cms/authors/new">New Author</Link>
      </div>
      <ul className="mt-4 space-y-2">
        {authors.map((a) => (
          <li key={a.authorId}>
            {a.authorName} <Link href={`/cms/authors/${a.authorId}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
