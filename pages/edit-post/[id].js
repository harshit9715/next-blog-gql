import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false })

import { getPost } from '../../graphql/queries'
import { updatePost } from '../../graphql/mutations'

function EditPost() {
    const [post, setPost] = useState(null);
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        fetchPost()
        async function fetchPost() {
            if (!id) return
            const postData = await API.graphql({ query: getPost, variables: { id } })
            setPost(postData.data.getPost)
        }
    }, [id])
    if (!post) return null;

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Update post</h1>
            <input
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={post.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-fill font-light text-gray-500 placeholder-gray-500 y-2"
            />
            <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />

            <button
                type="button"
                className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
                onClick={updateCurrentPost}
            >Update Post</button>
        </div>
    )

    function onChange(e) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }))
    }

    async function updateCurrentPost() {
        const { title, content } = post
        console.log(title, content)
        if (!title || !content) return
        await API.graphql({
            query: updatePost,
            variables: { input: { title, content, id } },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })
        console.log('post updated successfully!')
        router.push(`/my-posts`)
    }
}

export default EditPost;