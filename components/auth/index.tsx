import Image from 'next/image';
import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import Link from 'next/link';

const AuthPage = () => {
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
          
          className="bg-white border border-gray-300 rounded-sm py-2 font-medium flex items-center justify-center gap-2"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={1000}
            height={1000}
            alt="Google logo"
            className="w-5 h-5"
            priority
          />
          Login with Google
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
