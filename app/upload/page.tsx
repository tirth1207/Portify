"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, Lock } from 'lucide-react'
import BlurFade from "@/components/magicui/blur-fade"
import AuthButton from "@/components/AuthButton"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function UploadPage() {
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return

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

      // Save to Supabase
      const { data, error } = await supabase.from("portfolios").insert({
        user_id: user!.id,
        name: result.name || "Untitled Portfolio",
        title: result.title || "",
        summary: result.summary || "",
        skills: result.skills || [],
        projects: result.projects || [],
        education: result.education || [],
        experience: result.experience || [],
        template: "minimal",
      })

      if (error) {
        console.error("Error saving to database:", error)
        // Still proceed with localStorage as fallback
      }

      localStorage.setItem("parsedResume", JSON.stringify(result))
      router.push("/onboarding")
    } catch (error) {
      console.error("Error parsing resume:", error)
      alert("Error parsing resume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
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
                <AuthButton />
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upload Your Resume</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload your PDF resume and let our AI extract your information
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Signed in as {user.email}
            </p>
          </div>
        </BlurFade>

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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Drop your resume here</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">or click to browse files</p>
                    <Button
                      onClick={() => inputRef.current?.click()}
                      className="bg-black hover:bg-gray-800 text-white"
                      disabled={loading}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                    <input ref={inputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Supports PDF files up to 10MB</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    </div>
  )
}
