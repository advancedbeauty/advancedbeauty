import React from 'react';
import { auth } from '@/auth';
import Link from 'next/link';
import { Suspense } from 'react';
import RedirectCountdown from '@/components/ui/features/RedirectCountdown';

const page = async () => {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access wishlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="bg-[#D9C1A3] hover:bg-[#c4ac8e] text-black font-medium py-2 px-6 rounded transition-colors"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded transition-colors"
            >
              Back to Home
            </Link>
          </div>
          <div className="mt-5">
            <Suspense
              fallback={
                <p className="text-sm text-gray-500">
                  Redirecting to home page soon...
                </p>
              }
            >
              <RedirectCountdown seconds={7} redirectUrl="/" />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
  return <div>page</div>;
};

export default page;
