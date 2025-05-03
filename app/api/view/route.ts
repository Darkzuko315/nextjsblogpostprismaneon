import { prisma } from "@/connections/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, posts: blogPosts });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch Blogposts" + error },
      { status: 500 }
    );
  }
}
