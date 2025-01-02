import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";

export default async function RolePage() {
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

    return (
        <div>
            <h2>Role: {currentUser?.role}</h2>
        </div>
    );
}
