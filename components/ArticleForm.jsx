"use client";
// components/ArticleForm.jsx
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getArticle, getAuthors, getCategories } from "@/lib/api";

const ClientTiptapEditor = dynamic(() => import("./ClientTiptapEditor"), {
  ssr: false,
  loading: () => <div className="editor-input border rounded p-2 min-h-[200px]">Loading editor…</div>,
});

export default function ArticleForm({ articleId }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
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
    },
  });

  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, authRes] = await Promise.all([getCategories(), getAuthors()]);
        setCategories(catRes.data.categories || []);
        setAuthors(authRes.data.authors || []);

        if (articleId) {
          const artRes = await getArticle(articleId);
          const data = artRes.data;
          reset({
            ...data,
            hero: data.articleImage || "",
            tags: data.tags || [],
            description: data.description || "",
            published: data.published ? new Date(data.published).toISOString().split("T")[0] : "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, [articleId, reset]);

  const onSubmit = async (formData) => {
    try {
      if (formData?.hero) {
        formData.articleImage = formData.hero;
      }
      if (articleId) await updateArticle(articleId, formData);
      else await createArticle(formData);
      router.push("/cms/articles");
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingData) {
    return <div className="p-6 text-center">Loading…</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-8">
      {/* Basic Info Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">{articleId ? "Edit Article" : "Create Article"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              className={`input ${errors.title ? "border-red-500" : ""}`}
              placeholder="Article title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input {...register("subtitle")} className="input" placeholder="Article subtitle" />
          </div>
          {/* Hero Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Hero Image URL</label>
            <input {...register("hero")} className="input" placeholder="https://example.com/image.jpg" />
          </div>
        </div>
      </section>

      {/* Tags & Settings */}
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Content *</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => <ClientTiptapEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/cms/articles")}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : articleId ? "Update Article" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
