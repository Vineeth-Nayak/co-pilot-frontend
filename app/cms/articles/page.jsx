import Link from "next/link";
import { getArticles } from "@/lib/api";
import { PlusIcon, Edit2Icon } from "lucide-react";

export default async function ArticlesPage() {
  const res = await getArticles();
  const articles = res.data.articles;
  console.log(articles);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Articles</h1>
        <Link
          href="/cms/articles/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <div key={a.articleObjectId} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
            <img src={a.hero} alt={a.title} className="w-full h-40 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">{a.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Type: <span className="capitalize">{a.articleType === 1 ? "Text" : a.articleType === 2 ? "Audio" : "Video"}</span>
            </p>
            <div className="flex justify-end">
              <Link
                href={`/cms/articles/${a.articleObjectId}`}
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                <Edit2Icon className="w-4 h-4 mr-1" />
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
