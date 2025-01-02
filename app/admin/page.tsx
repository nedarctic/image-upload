"use client";

import React, { useReducer, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

type FormValues = {
    title: string;
    url: string;
    category: string;
    description: string;
    image?: FileList | null;
};

const CREATE_LINK_MUTATION = gql`
  mutation CreateLink(
    $title: String!
    $url: String!
    $imageUrl: String!
    $category: String!
    $description: String!
  ) {
    createLink(
      title: $title
      url: $url
      imageUrl: $imageUrl
      category: $category
      description: $description
    ) {
      title
      url
      imageUrl
      category
      description
    }
  }
`;

type State = {
    isSubmitting: boolean;
    error: string | null;
};

type Action = { type: "SUBMIT" } | { type: "SUCCESS" } | { type: "ERROR"; payload: string };

function formReducer(state: State, action: Action): State {
    switch (action.type) {
        case "SUBMIT":
            return { ...state, isSubmitting: true, error: null };
        case "SUCCESS":
            return { ...state, isSubmitting: false, error: null };
        case "ERROR":
            return { ...state, isSubmitting: false, error: action.payload };
        default:
            return state;
    }
}

export default function AdminPage() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
    const { user, isLoading } = useUser();
    const router = useRouter();
    const [state, dispatch] = useReducer(formReducer, { isSubmitting: false, error: null });
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        onCompleted: () => {
            dispatch({ type: "SUCCESS" });
            reset();
            setUploadedImage(null); // Reset image after successful submission
            toast.success("Link successfully created!");
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            dispatch({ type: "ERROR", payload: message });
            toast.error("Failed to create link. Please try again.");
        },
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return (
            <div className="container mx-auto max-w-md py-12 text-center">
                <h1 className="text-2xl font-medium">You need to log in to add links.</h1>
                <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => router.push("/api/auth/login")}
                >
                    Login
                </button>
            </div>
        );
    }

    const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const filename = encodeURIComponent(file.name);
        const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

        if (!bucketName) {
            toast.error("S3 bucket name is not defined in environment variables.");
            return;
        }

        setIsUploading(true);
        try {
            const res = await fetch(`/api/upload-image`, {
                method: "POST", // Use POST instead of GET
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ file: filename }), // Send the file name as JSON
            });

            // Check if the response is OK
            if (!res.ok) {
                console.error("Failed to fetch upload URL:", res.status, res.statusText);
                toast.error("Failed to fetch upload URL. Please try again.");
                return;
            }

            // Attempt to parse the response as JSON
            let data;
            try {
                data = await res.json();
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                toast.error("Received invalid JSON from the server.");
                return;
            }

            // Proceed with the upload
            const formData = new FormData();
            Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
                formData.append(key, value as string | Blob);
            });

            const upload = await fetch(data.url, { method: "POST", body: formData });

            if (upload.ok) {
                const imageUrl = `https://${bucketName}.s3.amazonaws.com/${file.name}`;
                setUploadedImage(imageUrl);
                toast.success("Image successfully uploaded!");
                console.log("Uploaded image URL:", imageUrl);
            } else {
                console.error("Upload failed:", upload.status, upload.statusText);
                toast.error("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during image upload:", error);
            toast.error("An error occurred during image upload.");
        } finally {
            setIsUploading(false);
        }
    };



    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const { title, url, category, description } = data;

        if (!uploadedImage) {
            toast.error("Please upload an image before submitting.");
            return;
        }

        dispatch({ type: "SUBMIT" });
        try {
            await createLink({ variables: { title, url, imageUrl: uploadedImage, category, description } });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unexpected error occurred.";
            dispatch({ type: "ERROR", payload: message });
        }
    };

    return (
        <div className="container mx-auto max-w-md py-12">
            <Toaster />

            <h1 className="text-3xl font-medium my-5">Create a New Link</h1>

            {state.error && <p className="text-red-500 mb-4">{state.error}</p>}

            <form
                className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
                onSubmit={handleSubmit(onSubmit)}
            >
                <label>
                    <span>Title</span>
                    <input className="mx-2 p-4 border-2 border-black" type="text" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p>{errors.title.message}</p>}
                </label>
                <label>
                    <span>URL</span>
                    <input className="mx-2 p-4 border-2 border-black" type="url" {...register("url", { required: "URL is required" })} />
                    {errors.url && <p>{errors.url.message}</p>}
                </label>
                <label>
                    <span>Category</span>
                    <input className="mx-2 p-4 border-2 border-black" type="text" {...register("category", { required: "Category is required" })} />
                    {errors.category && <p>{errors.category.message}</p>}
                </label>
                <label>
                    <span>Description</span>
                    <textarea className="mx-2 p-4 border-2 border-black" {...register("description", { required: "Description is required" })} />
                    {errors.description && <p>{errors.description.message}</p>}
                </label>
                <label>
                    <span>Upload Image</span>
                    <input className="mx-2 p-4 border-2 border-black" type="file" accept="image/png, image/jpeg" onChange={uploadPhoto} />
                </label>
                <button className="p-4 bg-yellow-200 text-black rounded" type="submit" disabled={state.isSubmitting || isUploading}>
                    {state.isSubmitting ? "Submitting..." : isUploading ? "Uploading Image..." : "Create Link"}
                </button>
            </form>
        </div>
    );
}
