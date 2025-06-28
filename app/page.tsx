import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Upload, Palette, Download, Sparkles, Zap, Users } from 'lucide-react'
import Link from "next/link"
import BlurFade from "@/components/magicui/blur-fade"
import BlurFadeText from "@/components/magicui/blur-fade-text"
import AuthButton from "@/components/AuthButton"

const BLUR_FADE_DELAY = 0.04

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl">Portfolio Builder</div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button >Sign In</Button>
            </Link>
            {/* <AuthButton /> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
              text="Build Your Perfect Portfolio in Minutes"
            />
            <BlurFade delay={BLUR_FADE_DELAY * 2}>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Transform your resume into a stunning portfolio website with AI. Upload your PDF, choose a template, and
                launch your professional presence.
              </p>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/login">
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                  View Examples
                </Button>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
            <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Four simple steps to your professional portfolio
              </p>
            </div>
          </BlurFade>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: "Sign Up",
                  description: "Create your account to get started and save your portfolios securely.",
                  delay: BLUR_FADE_DELAY * 5,
                },
                {
                  icon: Upload,
                  title: "Upload Resume",
                  description: "Simply drag and drop your PDF resume. Our AI will extract all your information.",
                  delay: BLUR_FADE_DELAY * 6,
                },
                {
                  icon: Palette,
                  title: "Choose Template",
                  description: "Select from our collection of beautiful, professional portfolio templates.",
                  delay: BLUR_FADE_DELAY * 7,
                },
                {
                  icon: Download,
                  title: "Deploy & Share",
                  description: "Your portfolio is ready! Deploy to a custom subdomain and share with the world.",
                  delay: BLUR_FADE_DELAY * 8,
                },
              ].map((step, index) => (
                <BlurFade key={step.title} delay={step.delay}>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">{step.title}</dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{step.description}</dd>
                  </div>
                </BlurFade>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-slate-800/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Why Choose Our Portfolio Builder?
              </h2>
            </div>
          </BlurFade>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered",
                  description: "Advanced AI extracts and organizes your resume data intelligently.",
                  delay: BLUR_FADE_DELAY * 10,
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Create your portfolio in under 5 minutes. No coding required.",
                  delay: BLUR_FADE_DELAY * 11,
                },
                {
                  icon: Users,
                  title: "Professional Templates",
                  description: "Choose from designer-crafted templates that impress employers.",
                  delay: BLUR_FADE_DELAY * 12,
                },
              ].map((feature) => (
                <BlurFade key={feature.title} delay={feature.delay}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <feature.icon className="h-12 w-12 text-black dark:text-white mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Ready to Build Your Portfolio?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Join thousands of professionals who've created stunning portfolios with our platform.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/login">
                  <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg">
                    Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}
