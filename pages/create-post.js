import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import { API } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false })

import { createPost } from '../graphql/mutations';
const initialState = { title: '', content: '' }

function CreatePost({ isPassedToWithAuthenticator, user }) {
    if (!isPassedToWithAuthenticator) {
        throw new Error(`isPassedToWithAuthenticator was not provided`);
    }
    const [post, setPost] = useState(initialState);
    const { content, title } = post;
    const router = useRouter();

    function onChange(e) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }))
    }

    async function createNewPost() {
        if (!title || !content) return
        const id = uuid()
        post.id = id

        await API.graphql({
            query: createPost,
            variables: { input: post },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        })
        router.push(`/posts/${id}`)
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
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
                onClick={createNewPost}
            >Create Post</button>
        </div>
    )
}

export default withAuthenticator(CreatePost, {
    signUpAttributes: ['email']
});


export async function getStaticProps() {
    return {
        props: {
            isPassedToWithAuthenticator: true,
        },
    };
}