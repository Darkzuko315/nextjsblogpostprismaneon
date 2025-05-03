// app/api/read/[id]/route.ts

import { prisma } from "@/connections/prisma";
import { NextResponse } from "next/server";

type getProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: getProps) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Blogpost not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post }); // ✅ this name matters
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to view Blogpost: " + error },
      { status: 500 }
    );
  }
}

// Delete Route

export async function DELETE(request: Request, { params }: getProps) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.blogPost.delete({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Blogpost not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post }); // ✅ this name matters
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete Blogpost: " + error },
      { status: 500 }
    );
  }
}
