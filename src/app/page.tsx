import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInButton from "@/components/auth/SignInButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <header className="py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Potemkin</h1>
          {session ? (
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignInButton 
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign in with Google
            </SignInButton>
          )}
        </div>
      </header>
      
      <main className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Streamline Your Entity Formation Process</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Form your business entity quickly and easily with Potemkin. We guide you through the process step by step.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Simple Process</h3>
              <p className="text-gray-600 dark:text-gray-300">Answer a few questions to get started with your entity formation</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600 dark:text-gray-300">Your data is protected with industry-standard security practices</p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Setup</h3>
              <p className="text-gray-600 dark:text-gray-300">Get your business entity formed quickly and efficiently</p>
            </div>
          </div>
          
          <div className="mt-12">
            {!session && (
              <SignInButton 
                className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-lg font-medium"
              >
                Get Started
              </SignInButton>
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400">
          <p> {new Date().getFullYear()} Potemkin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
