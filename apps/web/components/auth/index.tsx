'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createGoogleAuthHandler } from '@/lib/google-auth'
import Section from '@workspace/ui/components/shared/Section'
import Container from '@workspace/ui/components/shared/Container'

const AuthPage = () => {
  const [error, setError] = useState<string>('')
  const handleGoogleAuth = createGoogleAuthHandler(setError)
  return (
    <Section className='md:py-20'>
      <Container className="mt-10 md:mt-20 mb-20 flex flex-col gap-7">
        <div className="flex flex-col gap-4">
          <span className="font-medium text-center text-3xl md:text-4xl">
            Sign in or create an account
          </span>
          <span className="text-center text-[14px] max-w-[500px]">
            Elevate Your Beauty Experience with Advanced Beauty: One Account, Endless Possibilities!
          </span>
        </div>
        <button
          onClick={handleGoogleAuth}
          className="bg-white border hover:bg-gray-100 border-gray-300 hover:border-gray-100 transition rounded-sm py-2 font-medium flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
        <div className="max-w-[500px] text-center text-[12px]">
          <span className="">By continuing, you have read and agree to our {` `}</span>
          <Link href="/legal/tnc" className="text-blue-500 font-medium">
            Terms and Conditions
          </Link>
          ,{` `}
          <Link href="/legal/privacy-policy" className="text-blue-500 font-medium">
            Privacy Statement
          </Link>
          .
        </div>
      </Container>
    </Section>
  )
}

export default AuthPage
