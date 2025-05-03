import { prisma } from "@/connections/prisma";
import { NextResponse } from "next/server";

type editProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: editProps) {
  const { id } = await params;
  const { author, title, content, photo } = await request.json();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!author || !title || !content || !photo) {
    return NextResponse.json(
      { success: false, message: "All required fields" },
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
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        author,
        title,
        content,
        photo,
      },
    });

    return NextResponse.json({ success: true, updatedPost });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update post" + error },
      { status: 500 }
    );
  }
}
