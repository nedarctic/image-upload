"use client";
import React from "react";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <ApolloProvider client={apolloClient}>
                {children}
            </ApolloProvider>
        </div>
    );
}