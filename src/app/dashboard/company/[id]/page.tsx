import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import db from "@/db";
import { companies, founders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  // Redirect to home page if not authenticated
  if (!session?.user) {
    redirect("/");
  }
  
  // Fetch company details
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.id, (await params).id))
    .then(rows => rows[0]);
  
  // If company not found or doesn't belong to the user, redirect to dashboard
  if (!company || company.userId !== session.user.id) {
    redirect("/dashboard");
  }
  
  // Fetch company founders
  const companyFounders = await db
    .select()
    .from(founders)
    .where(eq(founders.companyId, (await params).id))
    .then(rows => rows);
  
  // Format date
  const formattedDate = new Date(company.createdAt || Date.now()).toLocaleDateString();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Potemkin</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Dashboard
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {session.user.email}
            </div>
            <Link
              href="/api/auth/signout"
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{company.name}</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Entity Details</h3>
              <dl className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Entity Type</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{company.entityType}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">State</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{company.state}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Incorporator</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{company.incorporator}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{formattedDate}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Founders</h3>
              {companyFounders.length > 0 ? (
                <ul className="space-y-3">
                  {companyFounders.map((founder) => (
                    <li key={founder.id} className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-md">
                      {founder.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No founders added</p>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4">Formation Process</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-md font-medium">Entity Created</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">We&apos;ve received your entity formation details.</p>
              </div>
              
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">2</span>
                </div>
                <h4 className="text-md font-medium text-gray-500 dark:text-gray-400">Documents Preparation</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your formation documents are being prepared.</p>
              </div>
              
              <div className="relative pl-8 pb-6">
                <div className="absolute left-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">3</span>
                </div>
                <h4 className="text-md font-medium text-gray-500 dark:text-gray-400">State Filing</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your documents will be filed with the state.</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">4</span>
                </div>
                <h4 className="text-md font-medium text-gray-500 dark:text-gray-400">Completed</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your formation process will be completed and you&apos;ll receive your documents.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
