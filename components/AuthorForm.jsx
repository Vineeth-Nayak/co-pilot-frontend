"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createAuthor, updateAuthor, getAuthor } from "@/lib/api";
import { useEffect } from "react";

export default function AuthorForm({ authorId }) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const mode = !!authorId;

  useEffect(() => {
    if (mode) getAuthor(authorId).then((res) => reset(res.data));
  }, [authorId, mode, reset]);

  const onSubmit = async (data) => {
    if (mode) await updateAuthor(authorId, data);
    else await createAuthor(data);
    router.push("/cms/authors");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("authorName", { required: true })} placeholder="Author Name" />
      <input {...register("authorImage")} placeholder="Image URL" />
      <textarea {...register("description")} placeholder="Description" />
      <button type="submit">{mode ? "Update" : "Create"}</button>
    </form>
  );
}
