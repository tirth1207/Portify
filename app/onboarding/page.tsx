"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Lock } from "lucide-react"
import BlurFade from "@/components/magicui/blur-fade"
import ProBadge from "@/components/ProBadge"
import { canUseProTemplates, getUserPlan } from "@/lib/subscription-client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const templates = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean typography and whitespace for timeless elegance",
    features: ["Clean Typography", "Minimal Design", "Fast Loading"],
    style: "minimal",
    accent: "slate",
    isPro: false,
  },
  {
    id: "simple",
    name: "simple",
    description: "Clean typography and whitespace for timeless elegance",
    features: ["Clean Typography", "Minimal Design", "Fast Loading"],
    style: "minimal",
    accent: "slate",
    isPro: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary gradients with smooth animations",
    features: ["Gradient Backgrounds", "Smooth Animations", "Interactive Elements"],
    style: "modern",
    accent: "blue",
    isPro: false,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold colors and artistic layouts for creative minds",
    features: ["Bold Colors", "Artistic Layout", "Creative Elements"],
    style: "creative",
    accent: "purple",
    isPro: true,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate-friendly design for business professionals",
    features: ["Corporate Style", "Professional Layout", "Business Colors"],
    style: "professional",
    accent: "green",
    isPro: false,
  },
  {
    id: "tech",
    name: "Tech",
    description: "Terminal-inspired design for developers and engineers",
    features: ["Code Aesthetic", "Terminal Style", "Developer Focused"],
    style: "tech",
    accent: "green",
    isPro: true,
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Vibrant and expressive design for creative professionals",
    features: ["Vibrant Colors", "Artistic Elements", "Creative Layouts"],
    style: "artistic",
    accent: "rainbow",
    isPro: true,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior leadership roles",
    features: ["Executive Style", "Leadership Focus", "Professional Impact"],
    style: "executive",
    accent: "slate",
    isPro: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Ultimate glassmorphism design with animated elements",
    features: ["Glassmorphism", "Animated Backgrounds", "Premium Effects"],
    style: "premium",
    accent: "purple",
    isPro: true,
  },
]

const TemplatePreview = ({ template, isSelected }: { template: any; isSelected: boolean }) => {
  const getPreviewContent = () => {
    switch (template.style) {
      case "minimal":
        return (
          <div className="w-full h-full bg-white dark:bg-slate-900 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-3/4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-1/2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="flex gap-1 mt-3">
              <div className="w-8 h-4 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
              <div className="w-6 h-4 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
            </div>
          </div>
        )
      case "tech":
        return (
          <div className="w-full h-full bg-slate-900 text-green-400 p-4 font-mono text-xs">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-1">
              <div className="text-green-500">$ whoami</div>
              <div className="text-green-300">john_developer</div>
              <div className="text-green-500">$ cat skills.json</div>
              <div className="text-green-300">{"{"}</div>
              <div className="text-green-300 ml-2">"languages": ["JS", "Python"]</div>
              <div className="text-green-300">{"}"}</div>
            </div>
          </div>
        )
      case "artistic":
        return (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100 dark:from-pink-900 dark:via-purple-900 dark:to-orange-900 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-gradient-to-r from-pink-300 to-purple-400 rounded"></div>
                <div className="w-12 h-1.5 bg-purple-200 dark:bg-purple-800 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="w-full h-1.5 bg-purple-200 dark:bg-purple-800 rounded"></div>
              <div className="w-3/4 h-1.5 bg-pink-200 dark:bg-pink-800 rounded"></div>
              <div className="w-1/2 h-1.5 bg-orange-200 dark:bg-orange-800 rounded"></div>
            </div>
            <div className="flex gap-1 mt-3">
              <div className="w-8 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-sm"></div>
              <div className="w-6 h-4 bg-gradient-to-r from-purple-400 to-orange-500 rounded-sm"></div>
            </div>
          </div>
        )
      case "executive":
        return (
          <div className="w-full h-full bg-slate-50 dark:bg-slate-800 p-4">
            <div className="bg-slate-800 text-white p-2 rounded mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-600"></div>
                <div className="space-y-1">
                  <div className="w-12 h-1.5 bg-slate-300 rounded"></div>
                  <div className="w-8 h-1 bg-slate-400 rounded"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="w-3/4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="flex justify-between mt-3">
              <div className="w-6 h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
              <div className="w-4 h-3 bg-slate-800 rounded"></div>
            </div>
          </div>
        )
      case "modern":
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-blue-200 dark:bg-blue-800 rounded"></div>
                <div className="w-12 h-1.5 bg-blue-100 dark:bg-blue-900 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="w-full h-1.5 bg-blue-200 dark:bg-blue-800 rounded"></div>
              <div className="w-3/4 h-1.5 bg-blue-200 dark:bg-blue-800 rounded"></div>
              <div className="w-1/2 h-1.5 bg-blue-200 dark:bg-blue-800 rounded"></div>
            </div>
            <div className="flex gap-1 mt-3">
              <div className="w-8 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-sm"></div>
              <div className="w-6 h-4 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-sm"></div>
            </div>
          </div>
        )
      case "creative":
        return (
          <div className="w-full h-full bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600"></div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-gradient-to-r from-pink-300 to-purple-400 rounded"></div>
                <div className="w-12 h-1.5 bg-purple-200 dark:bg-purple-800 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="w-full h-1.5 bg-purple-200 dark:bg-purple-800 rounded"></div>
              <div className="w-3/4 h-1.5 bg-pink-200 dark:bg-pink-800 rounded"></div>
              <div className="w-1/2 h-1.5 bg-indigo-200 dark:bg-indigo-800 rounded"></div>
            </div>
            <div className="flex gap-1 mt-3">
              <div className="w-8 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-sm"></div>
              <div className="w-6 h-4 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-sm"></div>
            </div>
          </div>
        )
      case "professional":
        return (
          <div className="w-full h-full bg-gray-50 dark:bg-slate-800 p-4 flex flex-col border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
              </div>
              <div className="space-y-1">
                <div className="w-16 h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-12 h-1.5 bg-green-200 dark:bg-green-800 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-3/4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-1/2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex gap-1 mt-3">
              <div className="w-8 h-4 bg-green-100 dark:bg-green-900 rounded-sm border border-green-200 dark:border-green-800"></div>
              <div className="w-6 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700"></div>
            </div>
          </div>
        )
      case "premium":
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 -left-2 w-16 h-16 bg-purple-500 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse"></div>
              <div className="absolute top-0 -right-2 w-16 h-16 bg-yellow-500 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse animation-delay-1000"></div>
              <div className="absolute -bottom-2 left-4 w-16 h-16 bg-pink-500 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-pulse animation-delay-2000"></div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-sm opacity-30 animate-pulse"></div>
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-600 border-2 border-white/20"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-16 h-2 bg-white/20 backdrop-blur-sm rounded"></div>
                  <div className="w-12 h-1.5 bg-purple-300/30 backdrop-blur-sm rounded"></div>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="w-full h-1.5 bg-white/10 backdrop-blur-sm rounded"></div>
                <div className="w-3/4 h-1.5 bg-purple-300/20 backdrop-blur-sm rounded"></div>
                <div className="w-1/2 h-1.5 bg-pink-300/20 backdrop-blur-sm rounded"></div>
              </div>
              <div className="flex gap-1 mt-3">
                <div className="w-8 h-4 bg-gradient-to-r from-purple-500/50 to-pink-500/50 backdrop-blur-sm rounded-sm border border-white/20"></div>
                <div className="w-6 h-4 bg-gradient-to-r from-pink-500/50 to-yellow-500/50 backdrop-blur-sm rounded-sm border border-white/20"></div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm">
      {getPreviewContent()}
      {isSelected && (
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-2">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function OnboardingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [hoveredTemplate, setHoveredTemplate] = useState<string>("")
  const [canUsePro, setCanUsePro] = useState(false)
  const [userPlan, setUserPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkPlanAccess = async () => {
      try {
        console.log("Debug - Checking plan access...")
        
        // Get user first
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log("Debug - No user found")
          setCanUsePro(false)
          setLoading(false)
          return
        }
        
        console.log("Debug - User found:", user.email)
        
        // Check plan access with retry
        let canUseProResult = false
        let plan = null
        let retries = 3
        
        while (retries > 0) {
          try {
            canUseProResult = await canUseProTemplates()
            plan = await getUserPlan()
            console.log("Debug - canUsePro result:", canUseProResult)
            console.log("Debug - user plan:", plan)
            break
          } catch (error) {
            console.error("Debug - Error on attempt", 4 - retries, ":", error)
            retries--
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
            }
          }
        }
        
        setCanUsePro(canUseProResult)
        setUserPlan(plan)
        
        // Double-check by directly querying the database
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single()
        
        console.log("Debug - Direct DB query subscription_tier:", profile?.subscription_tier)
        
      } catch (error) {
        console.error("Error checking plan access:", error)
        setCanUsePro(false)
      } finally {
        setLoading(false)
      }
    }

    checkPlanAccess()
  }, [])

  const handleSelect = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    console.log("Debug - Template selected:", templateId)
    console.log("Debug - Template isPro:", template?.isPro)
    console.log("Debug - canUsePro:", canUsePro)
    
    if (template?.isPro) {
      // Force refresh the plan check before blocking
      console.log("Debug - Pro template selected, re-checking access...")
      try {
        const freshCanUsePro = await canUseProTemplates()
        console.log("Debug - Fresh canUsePro check:", freshCanUsePro)
        
        if (!freshCanUsePro) {
          console.log("Debug - Blocking pro template selection")
          toast({
            title: "Pro Template Locked",
            description: "Upgrade to Standard or Pro plan to access premium templates.",
            variant: "destructive",
          })
          return
        } else {
          console.log("Debug - Pro template access confirmed")
          setCanUsePro(true) // Update state with fresh data
        }
      } catch (error) {
        console.error("Debug - Error re-checking pro access:", error)
        toast({
          title: "Error checking plan access",
          description: "Please try again.",
          variant: "destructive",
        })
        return
      }
    }
    
    console.log("Debug - Setting selected template:", templateId)
    setSelectedTemplate(templateId)
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      localStorage.setItem("selectedTemplate", selectedTemplate)
      router.push("/portfolio")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Style</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Select a template that reflects your professional personality and industry
            </p>
            {userPlan && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  Current Plan: <span className="font-semibold">{userPlan.name}</span>
                </span>
                {!canUsePro && (
                  <span className="text-yellow-600 dark:text-yellow-400">
                    • Pro templates locked
                  </span>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </BlurFade>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading templates...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {templates.map((template, index) => {
                const isLocked = template.isPro && !canUsePro
                return (
                  <BlurFade key={template.id} delay={0.2 + index * 0.1}>
                    <Card
                      className={`group transition-all duration-500 border-2 ${
                        isLocked 
                          ? "cursor-not-allowed opacity-60 border-gray-200 dark:border-gray-700"
                          : selectedTemplate === template.id
                          ? "cursor-pointer border-black dark:border-white shadow-xl scale-[1.02] hover:shadow-2xl"
                          : "cursor-pointer border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-2xl"
                      } bg-white dark:bg-slate-900`}
                      onClick={() => handleSelect(template.id)}
                      onMouseEnter={() => !isLocked && setHoveredTemplate(template.id)}
                      onMouseLeave={() => setHoveredTemplate("")}
                    >
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          {/* Template Preview */}
                          <div className="relative">
                            <TemplatePreview template={template} isSelected={selectedTemplate === template.id} />

                            {/* Selection Indicator */}
                            <div
                              className={`absolute -top-2 -right-2 transition-all duration-300 ${
                                selectedTemplate === template.id ? "scale-100 opacity-100" : "scale-0 opacity-0"
                              }`}
                            >
                              <div className="bg-black dark:bg-white text-white dark:text-black rounded-full p-2 shadow-lg">
                                <Check className="h-4 w-4" />
                              </div>
                            </div>

                            {/* Locked Overlay */}
                            {isLocked && (
                              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center rounded-xl">
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg">
                                  <Lock className="h-6 w-6 text-gray-500" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Template Info */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {template.name}
                                {template.isPro && <ProBadge />}
                              </h3>
                              <div
                                className={`transition-all duration-300 ${
                                  !isLocked && (hoveredTemplate === template.id || selectedTemplate === template.id)
                                    ? "translate-x-0 opacity-100"
                                    : "translate-x-2 opacity-0"
                                }`}
                              >
                                <ArrowRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{template.description}</p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2">
                              {template.features.map((feature, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>

                            {/* Locked Message */}
                            {isLocked && (
                              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                                  <Lock className="h-4 w-4 inline mr-1" />
                                  Upgrade to Standard or Pro plan to unlock this template
                                </p>
                                <Link href="/pricing">
                                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                                    View Plans
                                  </Button>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </BlurFade>
                )
              })}
            </div>

            <BlurFade delay={0.6}>
              <div className="text-center">
                <Button
                  onClick={handleContinue}
                  disabled={!selectedTemplate}
                  size="lg"
                  className={`px-12 py-4 text-lg font-semibold transition-all duration-300 ${
                    selectedTemplate
                      ? "bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl scale-100"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed scale-95"
                  }`}
                >
                  Continue to Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {selectedTemplate && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    You've selected the{" "}
                    <span className="font-semibold">{templates.find((t) => t.id === selectedTemplate)?.name}</span> template
                  </p>
                )}
              </div>
            </BlurFade>
          </>
        )}
      </div>
    </div>
  )
}
