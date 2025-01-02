"use client";
import { gql, useQuery } from '@apollo/client'
import type { Link } from '@prisma/client'
import { LinkComponent } from '../components/Link';

const AllLinksQuery = gql`
    query allLinksQuery($first: Int, $after: String) {
        links(first: $first, after: $after) {
            pageInfo {
                endCursor
                hasNextPage
            }
            edges {
                cursor
                node {
                    id
                    imageUrl
                    title
                    description
                    url
                    category
                }
            }
        }
    }
`

export default function LinksPage() {

    const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
        variables: { first: 2 },
    })

    if (loading) return <p>Loading...</p>
    if (error) return <p>An error occurred: {error.message}</p>

    const { endCursor, hasNextPage } = data.links.pageInfo;

    return (
        <div className='flex flex-col justify-center items-center space-y-10 container p-5 mx-auto'>
            <p className='text-4xl'>Links</p>
            <ul className='space-y-10'>
                {data?.links.edges.map(({ node }: { node: Link }) => (
                    <li key={node.id}>
                        <LinkComponent
                            imageUrl={node.imageUrl}
                            url={node.url}
                            title={node.title}
                            description={node.description}
                            category={node.category}
                        />
                    </li>
                ))}
            </ul>
            {hasNextPage ? (
                <button className='p-6 bg-yellow-200 text-black' onClick={() => 
                    fetchMore({
                        variables: { after: endCursor },
                        updateQuery: (prevResult, { fetchMoreResult }) => {
                            fetchMoreResult.links.edges = [
                                ...prevResult.links.edges,
                                ...fetchMoreResult.links.edges,
                            ];
                            return fetchMoreResult;
                        },
                })}>More</button>
            ): (<p>End</p>)}
        </div>
    );
}