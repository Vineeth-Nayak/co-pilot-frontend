import AuthorForm from "@/components/AuthorForm";

export default function EditAuthorPage({ params }) {
  return <AuthorForm authorId={params.id} />;
}
