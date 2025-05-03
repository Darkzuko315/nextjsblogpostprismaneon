"use client";

import { useEffect, useState } from "react";
import { SkeletonDemo } from "./skeleton";
import Link from "next/link";

interface Post {
  id: string;
  photo: string;
  title: string;
  author: string;
  createdAt: string;
  content: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/view");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
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
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <SkeletonDemo key={i} />
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No posts available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Basic Blog App
      </h1>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Latest Blog Posts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <img
                  src={post.photo}
                  alt={post.title}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  By <b className="text-yellow-500">{post.author}</b> —{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-800">{post.content.slice(0, 120)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
