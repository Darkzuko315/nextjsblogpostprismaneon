import { prisma } from "@/connections/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { author, title, content, photo } = await request.json();

  if (!author || !title || !content || !photo) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (author.length < 3 || title.length < 3 || content.length < 3) {
    return NextResponse.json(
      { success: false, message: "Fields must be at least 3 characters long" },
      { status: 400 }
    );
  }

  try {
    const newPost = await prisma.blogPost.create({
      data: {
        author,
        title,
        content,
        photo,
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create post" + error },
      { status: 500 }
    );
  }
}
