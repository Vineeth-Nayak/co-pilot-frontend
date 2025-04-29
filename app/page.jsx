"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiRefreshCw, FiFilter, FiChevronDown, FiX } from "react-icons/fi";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL on first load
  useEffect(() => {
    const initialFilters = {
      category: searchParams.get("category"),
      author: searchParams.get("author"),
      tag: searchParams.get("tag"),
      articleType: searchParams.get("type"),
    };

    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    fetchInitialData();

    // Only fetch articles if there are initial filters
    if (Object.values(initialFilters).some(Boolean)) {
      fetchArticles(initialFilters);
    } else {
      fetchArticles();
      setLoading(false);
    }
  }, []);

  // Fetch articles with filters
  const fetchArticles = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append("categoryId", filters.category);
      if (filters.author) params.append("authorName", filters.author);
      if (filters.tag) params.append("tag", filters.tag);
      if (filters.articleType) params.append("articleType", filters.articleType);

      const res = await fetch(`http://localhost:5000/api/articles?${params.toString()}`);
      const data = await res.json();
      setArticles(data.data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch categories and authors
  const fetchInitialData = async () => {
    try {
      const [categoriesRes, authorsRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/authors"),
      ]);

      const categoriesData = await categoriesRes.json();
      const authorsData = await authorsRes.json();

      setCategories(categoriesData.data.categories);
      setAuthors(authorsData.data.authors);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  // Update URL with current filters
  const updateUrl = (filters) => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.author) params.set("author", filters.author);
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.articleType) params.set("type", filters.articleType);

    router.replace(`/?${params.toString()}`);
  };

  // Handle draft filter changes (no API call)
  const handleDraftFilterChange = (name, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  // Apply filters (makes API call)
  const applyFilters = () => {
    const newFilters = { ...draftFilters };
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
    fetchArticles(newFilters);
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters = {
      category: null,
      author: null,
      tag: null,
      articleType: null,
    };
    setDraftFilters(newFilters);
    setAppliedFilters(newFilters);
    router.replace("/");
    fetchArticles(newFilters);
  };

  // Remove specific filter (makes API call)
  const removeFilter = (name) => {
    const newFilters = { ...appliedFilters, [name]: null };
    setDraftFilters(newFilters);
    setAppliedFilters(newFilters);
    updateUrl(newFilters);
    fetchArticles(newFilters);
  };

  // Handle pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchArticles(appliedFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Latest Articles</h1>
        <div className="flex space-x-2">
          <button onClick={handleRefresh} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <FiRefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={draftFilters.category || ""}
                onChange={(e) => handleDraftFilterChange("category", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <select
                value={draftFilters.author || ""}
                onChange={(e) => handleDraftFilterChange("author", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Authors</option>
                {authors.map((author) => (
                  <option key={author.authorId} value={author.authorName}>
                    {author.authorName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <input
                type="text"
                value={draftFilters.tag || ""}
                onChange={(e) => handleDraftFilterChange("tag", e.target.value)}
                placeholder="Enter tag name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Article Type</label>
              <select
                value={draftFilters.articleType || ""}
                onChange={(e) => handleDraftFilterChange("articleType", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Types</option>
                <option value="1">Text</option>
                <option value="2">Audio</option>
                <option value="3">Video</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => {
                setDraftFilters(appliedFilters);
                setShowFilters(false);
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(appliedFilters.category || appliedFilters.author || appliedFilters.tag || appliedFilters.articleType) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {appliedFilters.category && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>Category: {categories.find((c) => c.categoryId === appliedFilters.category)?.categoryName}</span>
              <button onClick={() => removeFilter("category")} className="ml-2 text-gray-500 hover:text-gray-700">
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}
          {appliedFilters.author && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>Author: {appliedFilters.author}</span>
              <button onClick={() => removeFilter("author")} className="ml-2 text-gray-500 hover:text-gray-700">
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}
          {appliedFilters.tag && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>Tag: {appliedFilters.tag}</span>
              <button onClick={() => removeFilter("tag")} className="ml-2 text-gray-500 hover:text-gray-700">
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}
          {appliedFilters.articleType && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <span>
                Type: {appliedFilters.articleType === "1" ? "Text" : appliedFilters.articleType === "2" ? "Audio" : "Video"}
              </span>
              <button onClick={() => removeFilter("articleType")} className="ml-2 text-gray-500 hover:text-gray-700">
                <FiX className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.articleObjectId} href={`/article/${article.articleObjectId}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              <div className="relative pt-[56.25%] overflow-hidden">
                <img src={article.hero} alt={article.title} className="absolute top-0 left-0 w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-blue-600">
                    {categories.find((c) => c.categoryId === article.categoryId)?.categoryName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(article.publishDate || new Date()).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{article.subtitle || "Read more about this article..."}</p>
                <div className="mt-auto">
                  <div className="flex items-center">
                    <img
                      src={authors.find((a) => a.authorId === article.authorId)?.authorImage || "/default-avatar.jpg"}
                      alt={article.authorName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {authors.find((a) => a.authorId === article.authorId)?.authorName || "Unknown Author"}
                    </span>
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
          <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
