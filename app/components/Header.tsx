"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';

// Define the User interface manually based on the expected shape
interface User {
    picture?: string;
    name?: string;
    email?: string;
    // Add any other fields from the Auth0 user object as needed
}

const Header = () => {
    const { user, isLoading } = useUser();

    // If user exists, cast the user object to your custom User type
    const userData = user as User | null;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    Links App
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {userData ? (
                        <div className="flex items-center space-x-5">
                            <Image alt="profile" className="rounded-full" width={50} height={50} src={userData.picture ? userData.picture : '/uservector.svg'} />
                            <div className="flex items-center justify-center mr-5 capitalize bg-blue-500 py-1 px-3 rounded-md text-white">
                                <Link href="/admin">
                                    + Create
                                </Link>
                            </div>
                            <Link href="/api/auth/logout" className="inline-flex items-center bg-yellow-300 border-2 border-black py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                                Logout
                            </Link>
                        </div>
                    ) : (
                        <Link href="/api/auth/login" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
