import type { Metadata } from "next";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog App",
  description: "My Basic Blog App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased mt-10 `}>
        <main className=" flex justify-center flex-row gap-[32px] row-start-2 items-center sm:items-start">
         <div className="flex flex-col gap-4 md:flex-row">
         
          <Link href="/">
            <Button className="w-[200px] cursor-pointer">Home</Button>
          </Link>

          <Link href="/createblog">
            <Button variant="outline" className="w-[200px] cursor-pointer">
              Create Blog
            </Button>
          </Link>

          
          </div>
        </main>
        {children}
      </body>
    </html>
  );
}
