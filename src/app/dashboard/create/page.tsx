"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateEntityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [incorporator, setIncorporator] = useState("");
  const [state, setState] = useState("");
  const [entityType, setEntityType] = useState("");
  const [founders, setFounders] = useState([{ id: 1, name: "" }]);

  const addFounder = () => {
    setFounders([...founders, { id: Date.now(), name: "" }]);
  };

  const removeFounder = (id: number) => {
    setFounders(founders.filter(founder => founder.id !== id));
  };

  const updateFounder = (id: number, name: string) => {
    setFounders(founders.map(founder => 
      founder.id === id ? { ...founder, name } : founder
    ));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          incorporator,
          state,
          entityType,
          founders: founders.map(f => f.name).filter(Boolean),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/company/${data.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Something went wrong"}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Potemkin</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to Dashboard
            </Link>
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
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Create a New Entity</h2>
          
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Entity Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Acme Corporation"
                />
              </div>
              
              <div>
                <label htmlFor="incorporator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Incorporator
                </label>
                <input
                  type="text"
                  id="incorporator"
                  value={incorporator}
                  onChange={(e) => setIncorporator(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., John Smith"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a state</option>
                    <option value="Delaware">Delaware</option>
                    <option value="Wyoming">Wyoming</option>
                    <option value="Nevada">Nevada</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Florida">Florida</option>
                    <option value="Texas">Texas</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="entityType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Entity Type
                  </label>
                  <select
                    id="entityType"
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select entity type</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="S-Corporation">S-Corporation</option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Founders
                </label>
                <div className="space-y-3">
                  {founders.map((founder, index) => (
                    <div key={founder.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={founder.name}
                        onChange={(e) => updateFounder(founder.id, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Founder name"
                      />
                      {founders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFounder(founder.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                        >
                          Remove
                        </button>
                      )}
                      {index === founders.length - 1 && (
                        <button
                          type="button"
                          onClick={addFounder}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md transition ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Entity"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
