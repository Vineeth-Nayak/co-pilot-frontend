"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, getCategory } from "@/lib/api";
import { useEffect } from "react";

export default function CategoryForm({ categoryId }) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const mode = !!categoryId;

  useEffect(() => {
    if (mode) getCategory(categoryId).then((res) => reset(res.data));
  }, [categoryId, mode, reset]);

  const onSubmit = async (data) => {
    if (mode) await updateCategory(categoryId, data);
    else await createCategory(data);
    router.push("/cms/categories");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("categoryName", { required: true })} placeholder="Category Name" />
      <button type="submit">{mode ? "Update" : "Create"}</button>
    </form>
  );
}
