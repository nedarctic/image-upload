import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, secret } = await request.json();

  // 1. Verify the method
  if (!request.method || request.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  // 2. Validate the secret
  if (secret !== process.env.AUTH0_HOOK_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  // 3. Check email
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  // 4. Create the user in the database if it doesn't exist
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    await prisma.user.create({
      data: { email },
    });
  }

  return NextResponse.json({
    message: `User with email: ${email} has been processed successfully.`,
  });
}
