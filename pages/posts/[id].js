import { API , Storage} from "aws-amplify";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { listPosts, getPost } from '../../graphql/queries'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Post({ post }) {
    const [coverImage, setCoverImage] = useState(null)
    const router = useRouter();

    useEffect(() => {
        updateCoverImage()
        async function updateCoverImage() {
            if (post?.coverImage) {
                const imageKey = await Storage.get(post.coverImage)
                setCoverImage(imageKey)
            }
        }
    }, [post?.coverImage])

    if (router.isFallback) {
        return <div>Loading...</div>
    }
    console.log(post.coverImage)
    return (
        <div>
            <h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title}</h1>
            {coverImage && (
                <div style={{width: '100%', height: '45vh', position: 'relative', marginBottom: '20px', marginTop: '20px'}}>
                        <Image src={coverImage} layout="fill" width='100%' height='100%' objectPosition={"relative !important"} className="rounded-2xl" alt="cover image" />
                    </div>
            )}
            <p className="text-sm font-light my-4">{post.username}</p>
            <div className="mt-8">
                <ReactMarkdown className="prose" >
                    {post.content}
                </ReactMarkdown>
            </div>

        </div>
    )
}

export async function getStaticPaths() {
    const postData = await API.graphql({
        query: listPosts
    })

    const paths = postData.data.listPosts.items.map(post => ({ params: { id: post.id } }))

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const { id } = params
    const postData = await API.graphql({
        query: getPost, variables: { id }
    })
    return {
        props: {
            post: postData.data.getPost
        },
        revalidate: 60
    }
}