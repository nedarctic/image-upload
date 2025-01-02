import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";
import { HomeComponent } from "./components/HomeComponent";
import Link from "next/link";

export default async function HomePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div>
        <p>You are not logged in</p>
        <button><Link href="/api/auth/login" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
          Login
        </Link></button>
      </div>
    );
  }

  const currentUser = await prisma.user.findUnique({
    select: {
      email: true,
      role: true,
    },
    where: {
      email: user.email,
    },
  });

  return (
    <div>
      <p>{currentUser?.role}</p>
      <HomeComponent />
    </div>
  );
}
