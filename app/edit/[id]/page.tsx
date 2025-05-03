"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    author: "",
    title: "",
    content: "",
    photo: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/read/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load post");

        const data = await res.json();
        setFormData({
          author: data.post.author,
          title: data.post.title,
          content: data.post.content,
          photo: data.post.photo,
        });
      } catch (err: any) {
        setError(err.message || "Error fetching post");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/edit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="p-6">Loading post...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Author"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          className="border p-2 rounded h-40"
          required
        />

        {error && <p className="text-red-500">{error}</p>}
        {success && (
          <p className="text-green-600">✅ Post updated successfully!</p>
        )}

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
