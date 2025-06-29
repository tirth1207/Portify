"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, Lock, AlertCircle, Crown, PenTool } from "lucide-react"
import BlurFade from "@/components/magicui/blur-fade"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { canCreatePortfolio, getUserPlan } from "@/lib/subscription-client"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [planCheckLoading, setPlanCheckLoading] = useState(true)
  const [canCreate, setCanCreate] = useState(false)
  const [planLimitReason, setPlanLimitReason] = useState<string>("")
  const [userPlan, setUserPlan] = useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user && !authLoading) {
      checkPlanLimits()
    }
  }, [user, authLoading])

  const checkPlanLimits = async () => {
    try {
      const result = await canCreatePortfolio()
      setCanCreate(result.canCreate)
      setPlanLimitReason(result.reason || "")
      
      const plan = await getUserPlan()
      setUserPlan(plan)
    } catch (error) {
      console.error("Error checking plan limits:", error)
      setCanCreate(false)
      setPlanLimitReason("Error checking plan limits")
    } finally {
      setPlanCheckLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (!user) return
    if (!canCreate) {
      toast({
        title: "Portfolio limit reached",
        description: planLimitReason,
        variant: "destructive",
      })
      return
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    if (!canCreate) {
      toast({
        title: "Portfolio limit reached",
        description: planLimitReason,
        variant: "destructive",
      })
      return
    }

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      alert("Please upload a PDF file")
      return
    }

    const formData = new FormData()
    formData.append("resume", file)

    setLoading(true)
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (result.error) {
        throw new Error(result.error)
      }

      // Transform the parsed data to match our database schema
      const portfolioData = {
        user_id: user!.id,
        name: result.name || "Untitled Portfolio",
        title: result.title || "",
        summary: result.summary || "",
        contact: result.contact || {},
        skills: result.skills || [],
        projects: result.projects || [],
        education: result.education || [],
        experience: result.experience || [],
        certifications: result.certifications || [],
        awards: result.awards || [],
        languages: result.languages || [],
        interests: result.interests || [],
        volunteer: result.volunteer || [],
        publications: result.publications || [],
        patents: result.patents || [],
        template: "minimal",
      }

      // Save to Supabase
      const { data, error } = await supabase.from("portfolios").insert(portfolioData)

      if (error) {
        console.error("Error saving to database:", error)
        // Still proceed with localStorage as fallback
      }

      localStorage.setItem("parsedResume", JSON.stringify(result))
      router.push("/onboarding")
    } catch (error) {
      console.error("Error parsing resume:", error)
      toast({
        title: "Error parsing resume",
        description: "Please try again with a different PDF file.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateManual = async () => {
    if (!user) return
    if (!canCreate) {
      toast({
        title: "Portfolio limit reached",
        description: planLimitReason,
        variant: "destructive",
      })
      return
    }

    // Create empty portfolio data
    const emptyPortfolioData = {
      user_id: user.id,
      name: "Untitled Portfolio",
      title: "",
      summary: "",
      contact: {},
      skills: [],
      projects: [],
      education: [],
      experience: [],
      certifications: [],
      awards: [],
      languages: [],
      interests: [],
      volunteer: [],
      publications: [],
      patents: [],
      template: "minimal",
    }

    try {
      // Save to Supabase
      const { data, error } = await supabase.from("portfolios").insert(emptyPortfolioData)

      if (error) {
        console.error("Error saving to database:", error)
        // Still proceed with localStorage as fallback
      }

      // Store empty data in localStorage
      localStorage.setItem("parsedResume", JSON.stringify({
        name: "Untitled Portfolio",
        title: "",
        summary: "",
        contact: {},
        skills: [],
        projects: [],
        education: [],
        experience: [],
        certifications: [],
        awards: [],
        languages: [],
        interests: [],
        volunteer: [],
        publications: [],
        patents: [],
      }))
      
      router.push("/user-details")
    } catch (error) {
      console.error("Error creating manual portfolio:", error)
      toast({
        title: "Error creating portfolio",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || planCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <BlurFade delay={0.1}>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800">
              <CardContent className="p-12 text-center">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sign In Required</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Please sign in to upload your resume and create your portfolio. Your data will be securely stored and
                  accessible across all your devices.
                </p>
                <Link href="/login">
                  <Button className="bg-black hover:bg-gray-800 text-white">Sign In to Continue</Button>
                </Link>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    )
  }

  if (!canCreate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <BlurFade delay={0.1}>
            <Card className="border-2 border-dashed border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio Limit Reached</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {planLimitReason}
                </p>
                {userPlan && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Current Plan: {userPlan.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Limit: {userPlan.limits.maxPortfolios === Infinity ? "∞" : userPlan.limits.maxPortfolios} portfolios
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      View My Portfolios
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button className="bg-black hover:bg-gray-800 text-white w-full">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <BlurFade delay={0.1}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Create Your Portfolio</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose how you'd like to get started
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Signed in as {user.email}</p>
            {userPlan && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {userPlan.name} Plan • {userPlan.limits.maxPortfolios === Infinity ? "∞" : userPlan.limits.maxPortfolios} portfolios
                </span>
              </div>
            )}
          </div>
        </BlurFade>

        <div className="space-y-6">
          {/* Upload Resume Option */}
          <BlurFade delay={0.2}>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <CardContent className="p-12">
                <div
                  className={`text-center ${dragActive ? "bg-gray-50 dark:bg-slate-800" : ""} rounded-lg p-8 transition-colors`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-16 w-16 text-gray-400 animate-spin mb-4" />
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Processing your resume...</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Our AI is extracting your information</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Your Resume</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Drop your PDF resume here or click to browse files</p>
                      <Button
                        onClick={() => inputRef.current?.click()}
                        className="bg-black hover:bg-gray-800 text-white"
                        disabled={loading || !canCreate}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Supports PDF files up to 10MB</p>
                      {!canCreate && (
                        <p className="text-xs text-red-500 mt-2">{planLimitReason}</p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </BlurFade>

          {/* Manual Creation Option */}
          <BlurFade delay={0.3}>
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 px-2 text-gray-500 dark:text-gray-400">
                    Or
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleCreateManual}
                  variant="ghost"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 px-4 py-2 rounded-lg transition-colors"
                  disabled={!canCreate}
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  Don't have a resume? Click here to create manually
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Start with a blank portfolio and fill in your details
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  )
}
