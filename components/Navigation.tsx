"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown, Home, FolderOpen, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getUserSubscriptionTier } from "@/lib/subscription-client"

export default function Navigation() {
  const [userTier, setUserTier] = useState<string>("free")
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    fetchUserTier()
  }, [])

  const fetchUserTier = async () => {
    try {
      const tier = await getUserSubscriptionTier()
      setUserTier(tier)
    } catch (error) {
      console.error("Error fetching user tier:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pro":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTierIcon = (tier: string) => {
    if (tier === "pro") return <Crown className="h-4 w-4" />
    return null
  }

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Portify
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/upload">
              <Button
                variant={pathname === "/upload" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Create Portfolio
              </Button>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Plan Badge */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Plan:</span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTierColor(userTier)}`}>
                {getTierIcon(userTier)}
                {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
              </div>
            </div>

            {/* Upgrade Button for non-Pro users */}
            {userTier !== "pro" && (
              <Link href="/pricing">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Crown className="h-4 w-4 mr-1" />
                  Upgrade
                </Button>
              </Link>
            )}

            {/* Sign Out */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 