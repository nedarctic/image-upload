"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export const HomeComponent = () => {
    const router = useRouter();
    const { user } = useUser();

    if (!user) {
        return (
            <div className="container p-4 mx-auto">
                <p>You need to log in</p>
            </div>
        );
    }

    // Pass the extended user object to the Role component
    return (
        <div className="container p-4 mx-auto">
            <h2 className="text-xl font-semibold">User Details</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <button
                    className="p-6 rounded-md bg-yellow-500 text-black"
                    onClick={() => router.push('/links')}
                >
                    Get links
                </button>
        </div>
    );
}
