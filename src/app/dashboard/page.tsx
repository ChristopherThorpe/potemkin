import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import db from "@/db";
import { companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect to home page if not authenticated
  if (!session?.user) {
    redirect("/");
  }
  
  // Fetch user's companies
  const userCompanies = await db
    .select()
    .from(companies)
    .where(eq(companies.userId, session.user.id))
    .then(rows => rows);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Potemkin</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {session.user.email}
            </div>
            <SignOutButton
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Sign Out
            </SignOutButton>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Your Entities</h2>
          <Link
            href="/dashboard/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Form a New Entity
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/dashboard/company/${company.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {company.entityType} • {company.state}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Date(company.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
          
          <Link
            href="/dashboard/create"
            className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition flex flex-col items-center justify-center text-center h-full min-h-[200px]"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Form a new entity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start the process of creating a new business entity
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
