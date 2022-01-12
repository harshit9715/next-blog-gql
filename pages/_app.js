import '../styles/globals.css'
import '../configureAmplify'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Auth, Hub } from 'aws-amplify'
import { data } from 'autoprefixer'

function MyApp({ Component, pageProps }) {
  const [isSignedIn, setSignedIn] = useState(false)

  useEffect(() => {
    authListener()
  }, [])

  async function authListener() {
    Hub.listen('auth', () => {
      switch (data.payload.event) {
        case 'signIn':
          return setSignedIn(true)
        case 'signOut':
          return setSignedIn(false)
      }
    })
    try {
      await Auth.currentAuthenticatedUser()
      setSignedIn(true)
    } catch (err) { }
  }
  return (
    <div>
      <nav className='p-6 border-gray-300'>
        <Link href="/" passHref>
          <span className='mr-6 cursor-pointer'>Home</span>
        </Link>
        <Link href="/create-post" passHref>
          <span className='mr-6 cursor-pointer'>Create Post</span>
        </Link>
        {
          isSignedIn && (
            <Link href="/my-posts" passHref>
              <span className='mr-6 cursor-pointer'>My Posts</span>
            </Link>
          )
        }
        <Link href="/profile" passHref>
          <span className='mr-6 cursor-pointer'>Profile</span>
        </Link>
      </nav>
      <div className='py-8 px-16'>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
