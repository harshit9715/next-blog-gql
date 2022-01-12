import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Auth } from "aws-amplify";


function Profile({ isPassedToWithAuthenticator, user }) {

    if (!isPassedToWithAuthenticator) {
        throw new Error(`isPassedToWithAuthenticator was not provided`);
    }

    const signOut = (e) => {
        e.preventDefault();
        Auth.signOut().then(() => {
            window.location.reload(false);
        });
    }
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
            <h3 className="font-medium text-gray-500 my-2">Username: {user.username}</h3>
            <p className="text-sm text-gray-500 mb-6">Email: {user.attributes.email}</p>
            <button
                className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
                onClick={signOut}>
                Sign out
            </button>
        </div>
    )

}



export default withAuthenticator(Profile, {
    signUpAttributes: ['email']
});

export async function getStaticProps() {
    return {
        props: {
            isPassedToWithAuthenticator: true,
        },
    };
}