"use client";

import React, { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";

const ViewBlog = () => {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePost = async () => {
    try {
      setIsDeleting(true);
      const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return; // User cancelled deletion
      const response = await fetch(`/api/read/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }
      redirect("/"); // Redirect to homepage after deletion
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/read/${id}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch the post");
        }
        const data = await response.json();
        setPost(data.post);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (isLoading)
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <div className="animate-spin h-5 w-5 ml-3 border-2 rounded-md"></div>
      </div>
    );
  if (error) return redirect("/"); // Redirect to homepage on error
  if (!post) return <p className="p-6">No post found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <img
        src={post.photo}
        alt={post.title}
        className="w-full h-80 object-cover rounded mb-6 shadow-2xl border-4 border-gray-800"
        loading="lazy"
      />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">
        By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-800 whitespace-pre-line leading-relaxed">
        {post.content}
      </p>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => redirect("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Back to Home
        </button>
        <button
          onClick={deletePost}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          {isDeleting ? "Deleting..." : "Delete Post"}
        </button>
        <button
          onClick={() => redirect(`/edit/${post.id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Edit Post
        </button>
      </div>
    </div>
  );
};

export default ViewBlog;
