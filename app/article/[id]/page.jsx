"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiTag } from "react-icons/fi";

export default function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveringAuthor, setHoveringAuthor] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${params.id}`);
        const data = await res.json();
        setArticle(data.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FiArrowLeft className="mr-2" />
        Back to Articles
      </Link>

      <article>
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            {article.category?.categoryName}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
          <h2 className="text-xl text-gray-600 mb-6">{article.Subtitle || article.subtitle}</h2>

          <div className="relative inline-block">
            <div
              className="flex items-center cursor-pointer"
              onMouseEnter={() => setHoveringAuthor(true)}
              onMouseLeave={() => setHoveringAuthor(false)}
            >
              <img
                src={article.author?.authorImage || "/default-avatar.jpg"}
                alt={article.author?.authorName}
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="text-gray-700">{article.author?.authorName}</span>
            </div>

            {hoveringAuthor && article.author?.description && (
              <div className="absolute z-10 left-0 mt-2 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <img
                    src={article.author?.authorImage || "/default-avatar.jpg"}
                    alt={article.author?.authorName}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <span className="font-medium">{article.author?.authorName}</span>
                </div>
                <p className="text-sm text-gray-600">{article.author?.description}</p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mt-1">
            Published on{" "}
            {new Date(article.publishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="relative pt-[56.25%] mb-8 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={article.hero || article.articleImage}
            alt={article.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>

        {article.articleType === "text" ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.description }} />
        ) : article.articleType === "video" ? (
          <div className="mb-8">
            <video controls className="w-full rounded-lg">
              <source src={article.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="mb-8">
            <audio controls className="w-full">
              <source src={article.mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="flex items-center text-lg font-medium text-gray-900 mb-3">
              <FiTag className="mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/?tag=${tag}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
