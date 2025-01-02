import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";
import { HomeComponent } from "./components/HomeComponent";
import Link from "next/link";

export default async function HomePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return(
      <div className="container px-4 mx-auto">
        <p>You are not logged in</p>
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
