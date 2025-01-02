import { NextResponse } from "next/server";
import aws from "aws-sdk";

export async function POST(req: Request) {
    try {
        const { file } = await req.json();

        if (!file || typeof file !== "string") {
            return NextResponse.json({ error: "Invalid file key" }, { status: 400 });
        }

        const s3 = new aws.S3({
            accessKeyId: process.env.APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.APP_AWS_SECRET_KEY,
            region: process.env.APP_AWS_REGION,
        });

        const post = await s3.createPresignedPost({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Fields: { key: file },
            Expires: 60,
            Conditions: [["content-length-range", 0, 5048576]],
        });

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        return NextResponse.json({ error: "Failed to generate pre-signed URL" }, { status: 500 });
    }
}
