'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong!
            </h1>
            
            <p className="mb-4 text-gray-700">
              We&apos;re sorry, but there was an error loading this page.
            </p>
            
            {error.digest && (
              <p className="mb-4 text-sm text-gray-500">
                Error reference: {error.digest}
              </p>
            )}
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Try Again
              </button>
              
              <Link href="/" className="px-4 py-2 border border-gray-300 text-center rounded hover:bg-gray-50 transition">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 