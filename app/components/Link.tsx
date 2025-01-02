import Image from "next/image"
import Link from "next/link";

export const LinkComponent = ({ imageUrl, url, title, description, category }: { imageUrl: string, url: string, title: string, description: string, category: string }) => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Image src={imageUrl} alt="alt" width={200} height={0} />
            <p className="text-4xl">{title}</p>
            <p className="text-lg">{category}</p>
            <p className="text-2xl">{description}</p>
            <Link href={url}>Link</Link>
        </div>
    );
}