import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef } from "react";
import { API, Storage } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import Image from "next/image";
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
    const [image, setImage] = useState(null);
    const hiddenFileInput = useRef(null);


    function onChange(e) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }))
    }

    async function uploadImage() {
        hiddenFileInput.current.click()
    }

    function handleChange(e) {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return
        setImage(fileUploaded);
    }

    async function createNewPost() {
        if (!title || !content) return
        const id = uuid()
        post.id = id

        if (image) {
            console.log(image)
            const fileName = `${image.name}_${uuid()}`
            post.coverImage = fileName
            await Storage.put(fileName, image)
        }

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
            {image && (
                <div style={{width: '100%', height: '45vh', position: 'relative', marginBottom: '20px', marginTop: '20px'}}>
                        <Image src={URL.createObjectURL(image)} layout="fill" width='100%' height='100%' objectPosition={"relative !important"} className="rounded-2xl" alt="cover image" />
                    </div>
            )}
            <input
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={post.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-fill font-light text-gray-500 placeholder-gray-500 y-2"
            />
            <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
            <input
                type="file"
                ref={hiddenFileInput}
                className="absolute w-0 h-0"
                onChange={handleChange}
            />
            <button
                className="bg-purple-600 text-white font-semibold px-8 py-2 rounded-lg mr-2"
                onClick={uploadImage}
            >
                {image?'Update': 'Upload'} Cover Image
            </button>
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