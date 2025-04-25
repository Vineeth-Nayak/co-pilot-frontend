"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { getCategories, getAuthors, createArticle, updateArticle, getArticle } from "@/lib/api";

// Dynamic imports for components that cause hydration issues
const CreatableSelect = dynamic(() => import("react-select/creatable").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="input">Loading tags...</div>,
});

const ClientSlateEditor = dynamic(() => import("./ClientEditor"), {
  ssr: false,
  loading: () => <div className="editor-input border rounded p-2 min-h-[200px]">Loading editor...</div>,
});

export default function ArticleForm({ articleId }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      hero: "",
      authorId: "",
      categoryId: "",
      tags: [],
      articleType: "text",
      description: "",
      mediaUrl: "",
      published: "",
      isFeatured: false,
      isDraft: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const articleType = watch("articleType");
  const mediaUrl = watch("mediaUrl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, authorsRes] = await Promise.all([getCategories(), getAuthors()]);

        setCategories(categoriesRes.data.categories || []);
        setAuthors(authorsRes.data.authors || []);

        if (articleId) {
          const articleRes = await getArticle(articleId);
          const data = articleRes.data;
          // console.log(data);
          reset({
            ...data,
            hero: data.articleImage || "",
            tags: data.tags || [],
            description: data.description || "",
            published: data.published ? new Date(data.published).toISOString().split("T")[0] : "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [articleId, reset]);

  const onSubmit = async (data) => {
    try {
      if (articleId) {
        await updateArticle(articleId, data);
      } else {
        await createArticle(data);
      }
      router.push("/cms/articles");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto p-6">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6 mt-6">
      <h2 className="text-2xl font-semibold">{articleId ? "Edit Article" : "Create Article"}</h2>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Article title"
              className={`input ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Subtitle</label>
            <input {...register("subtitle")} placeholder="Article subtitle" className="input" />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium">Hero Image URL</label>
            <input {...register("hero")} placeholder="https://example.com/image.jpg" className="input" />
          </div>
        </div>
      </div>

      {/* Author & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Author</label>
          <select {...register("authorId")} className="input" disabled={authors.length === 0}>
            <option value="">Select Author</option>
            {authors.map((a) => (
              <option key={a.authorId} value={a.authorId}>
                {a.authorName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Category</label>
          <select {...register("categoryId")} className="input" disabled={categories.length === 0}>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <label className="block text-sm font-medium">Tags</label>
        <Controller
          name="tags"
          control={control}
          render={({ field: { value, onChange } }) => (
            <CreatableSelect
              isMulti
              options={[]}
              value={(value || []).map((t) => ({ label: t, value: t }))}
              onChange={(opts) => onChange(opts.map((o) => o.value))}
              placeholder="Type tags & press enter"
              className="react-select-container"
              classNamePrefix="react-select"
              instanceId="tags-select"
            />
          )}
        />
      </div>

      {/* Article Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Article Type</label>
          <select {...register("articleType")} className="input">
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Publish Date</label>
          <input type="date" {...register("published")} className="input" />
        </div>

        <div className="flex items-end space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("isFeatured")} className="h-4 w-4 text-blue-600 rounded" />
            <span className="text-sm">Featured</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("isDraft")} className="h-4 w-4 text-blue-600 rounded" />
            <span className="text-sm">Draft</span>
          </label>
        </div>
      </div>

      {/* Content */}
      {articleType === "text" && (
        <div className="space-y-1">
          <label className="block text-sm font-medium">Content *</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => <ClientSlateEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>
      )}

      {/* Media URL & Preview */}
      {(articleType === "audio" || articleType === "video") && (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Media URL *</label>
            <input
              {...register("mediaUrl", { required: "Media URL is required" })}
              placeholder="https://example.com/media.mp4"
              className={`input ${errors.mediaUrl ? "border-red-500" : ""}`}
            />
            {errors.mediaUrl && <p className="text-red-500 text-xs">{errors.mediaUrl.message}</p>}
          </div>

          {mediaUrl && articleType === "video" && <video src={mediaUrl} controls className="w-full rounded-md" />}
          {mediaUrl && articleType === "audio" && (
            <audio controls className="w-full">
              <source src={mediaUrl} />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}

      {/* SEO Metadata
      <div className="space-y-4">
        <h3 className="text-lg font-medium">SEO Settings</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Meta Title</label>
            <input {...register("metaTitle")} placeholder="SEO title for search engines" className="input" />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Meta Description</label>
            <textarea
              {...register("metaDescription")}
              placeholder="SEO description for search engines"
              rows={3}
              className="input"
            />
          </div>
        </div>
      </div> */}

      {/* Submit */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/cms/articles")}
          className="px-6 py-2 border rounded hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : articleId ? "Update Article" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
