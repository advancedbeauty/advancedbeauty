'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);
  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: callbackUrl });
    } catch (error) {
      console.error('Unexpected Sign-in Error:', error);
    }
  };
  return (
    <Section className="min-h-[50vh]">
      <Container className="mt-10 md:mt-20 mb-20 flex flex-col gap-7">
        <div className="flex flex-col gap-4">
          <span className="font-medium text-center text-3xl md:text-4xl">
            Sign in or create an account
          </span>
          <span className="text-center text-[14px] max-w-[500px]">
            Elevate Your Beauty Experience with Advanced Beauty: One Account,
            Endless Possibilities!
          </span>
        </div>
        <button
          onClick={handleSignIn}
          className="bg-white border border-gray-300 rounded-sm py-2 font-medium flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-gray-50 transition"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={1000}
            height={1000}
            alt="Google logo"
            className="w-5 h-5"
            priority
          />
          Continue with Google
        </button>
        <div className="max-w-[500px] text-center text-[12px]">
          <span className="">
            By continuing, you have read and agree to our {` `}
          </span>
          <Link href="/legal/tnc" className="text-blue-500 font-medium">
            Terms and Conditions
          </Link>
          ,{` `}
          <Link
            href="/legal/privacy-policy"
            className="text-blue-500 font-medium"
          >
            Privacy Statement
          </Link>
          .
        </div>
      </Container>
    </Section>
  );
};

export default AuthPage;
