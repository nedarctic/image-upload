import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";

export const Role = async () => {
    const session = await getSession();
    const user = session?.user;

    if (!user) return <p>User session not retrieved from session object.</p>;

    const currentUser = await prisma.user.findUnique({
        select: {
            email: true,
            role: true,
        },
        where: {
            email: user.email,
        },
    });

    return currentUser?.role;
}
