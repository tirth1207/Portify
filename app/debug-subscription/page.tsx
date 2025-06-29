"use client"

import { useEffect, useState } from "react"
import { getUserSubscriptionTier, getUserPlan, canUseProTemplates, testSubscriptionAccess } from "@/lib/subscription-client"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugSubscriptionPage() {
  const [user, setUser] = useState<any>(null)
  const [subscriptionTier, setSubscriptionTier] = useState<string>("")
  const [userPlan, setUserPlan] = useState<any>(null)
  const [canUsePro, setCanUsePro] = useState<boolean>(false)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Get subscription tier
          const tier = await getUserSubscriptionTier()
          setSubscriptionTier(tier)

          // Get user plan
          const plan = await getUserPlan()
          setUserPlan(plan)

          // Check pro template access
          const canUseProResult = await canUseProTemplates()
          setCanUsePro(canUseProResult)

          // Get full profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Error checking subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  const updateSubscriptionTier = async (tier: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_tier: tier })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating subscription tier:", error)
        alert("Error updating subscription tier")
      } else {
        alert("Subscription tier updated successfully! Please refresh the page.")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating subscription tier:", error)
      alert("Error updating subscription tier")
    }
  }

  const runTest = async () => {
    try {
      const result = await testSubscriptionAccess()
      setTestResult(result)
      console.log("Test result:", result)
    } catch (error) {
      console.error("Test error:", error)
      setTestResult({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading subscription data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view subscription details</h1>
          <Button onClick={() => window.location.href = "/login"}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Subscription Debug</h1>
        
        <div className="grid gap-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Data */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p><strong>Subscription Tier (from DB):</strong> {subscriptionTier}</p>
                  <p><strong>User Plan:</strong> {userPlan?.name}</p>
                  <p><strong>Can Use Pro Templates:</strong> {canUsePro ? "✅ Yes" : "❌ No"}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Quick Actions:</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => updateSubscriptionTier("free")}
                      variant="outline"
                      size="sm"
                    >
                      Set to Free
                    </Button>
                    <Button 
                      onClick={() => updateSubscriptionTier("standard")}
                      variant="outline"
                      size="sm"
                    >
                      Set to Standard
                    </Button>
                    <Button 
                      onClick={() => updateSubscriptionTier("pro")}
                      variant="outline"
                      size="sm"
                    >
                      Set to Pro
                    </Button>
                    <Button 
                      onClick={runTest}
                      variant="outline"
                      size="sm"
                      className="bg-green-100 text-green-700 border-green-300"
                    >
                      Run Test
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Issue:</strong> Pro templates are locked even with Pro plan</p>
                <p><strong>Possible causes:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Subscription tier in database is not set to "pro"</li>
                  <li>Case sensitivity issues (should be lowercase "pro")</li>
                  <li>Profile record doesn't exist in the database</li>
                  <li>Database connection issues</li>
                </ul>
                <p><strong>Solution:</strong> Use the "Set to Pro" button above to update your subscription tier.</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 