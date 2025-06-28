"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UpgradePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to pricing page after a short delay
    const timer = setTimeout(() => {
      router.push("/pricing")
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Redirecting to Pricing...
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Taking you to our subscription plans
        </p>
        
        <Link
          href="/pricing"
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Go to Pricing Now
        </Link>
      </div>
    </div>
  )
}
