"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import BlurFade from "@/components/magicui/blur-fade"
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/lib/subscription-client"
import UpiQRCode from "@/components/UpiQRCode"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    transactionId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      toast({
        title: "You're already on the Free plan!",
        description: "This is the default plan for all users.",
      })
      return
    }
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    setIsSubmitting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`
      }

      const response = await fetch("/api/payment-proof", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...formData,
          plan: selectedPlan.name,
          amount: selectedPlan.price,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit payment proof")
      }

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
        toast({
          title: "Payment proof submitted successfully!",
          description: `We'll verify your payment and upgrade you to ${selectedPlan.name} within 24 hours.`,
        })
      } else {
        throw new Error(result.error || "Something went wrong")
      }
    } catch (error) {
      console.error("Payment proof submission error:", error)
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpiDeepLink = () => {
    if (!selectedPlan) return
    
    const upiId = "rathod2304hetal@okaxis"
    const amount = selectedPlan.price.toString()
    const note = `Portify ${selectedPlan.name} Upgrade`
    const upiUrl = `upi://pay?pa=${upiId}&pn=Portify&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`

    window.location.href = upiUrl
    
    toast({
      title: "Opening UPI app...",
      description: "If the app doesn't open, scan the QR code below.",
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-slate-900 dark:to-emerald-950 flex items-center justify-center p-4">
        <BlurFade delay={0.1}>
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Proof Submitted!
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Thank you for your submission. We'll verify your payment and upgrade you to{" "}
                <strong>{selectedPlan?.name}</strong> within 24 hours.
              </p>

              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>What's next?</strong>
                  <br />• We'll verify your transaction
                  <br />• You'll receive a confirmation email
                  <br />• {selectedPlan?.name} features will be activated automatically
                </p>
              </div>

              <Link href="/portfolio">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    )
  }

  if (showPayment && selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <BlurFade delay={0.1}>
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowPayment(false)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plans
              </Button>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Upgrade to {selectedPlan.name}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                Pay ₹{selectedPlan.price} to UPI ID:{" "}
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  rathod2304hetal@okaxis
                </span>
              </p>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <BlurFade delay={0.2}>
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Scan & Pay ₹{selectedPlan.price}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="w-64 h-64 mx-auto mb-6 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg p-4">
                    <UpiQRCode 
                      upiId="rathod2304hetal@okaxis" 
                      amount={selectedPlan.price}
                      name="Portify"
                      note={`Portify ${selectedPlan.name} Upgrade`}
                    />
                  </div>

                  <Button
                    onClick={handleUpiDeepLink}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
                  >
                    Pay with UPI App
                  </Button>
                </CardContent>
              </Card>
            </BlurFade>

            {/* Payment Form Section */}
            <BlurFade delay={0.3}>
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Submit Payment Proof</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    After making the payment, please fill out this form for verification
                  </p>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name *</label>
                      <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transaction ID *</label>
                      <input
                        name="transactionId"
                        type="text"
                        placeholder="Enter UPI transaction ID"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        You can find this in your UPI app's transaction history
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.email || !formData.transactionId}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Payment Proof"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Portfolio
            </Link>

            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Plan
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features with different limits and capabilities.
            </p>
          </div>
        </BlurFade>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan, index) => (
            <BlurFade key={plan.name} delay={0.2 + index * 0.1}>
              <Card className={`relative shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.name === "Pro" ? "ring-2 ring-purple-500 shadow-purple-500/20" : ""
              }`}>
                {plan.name === "Pro" && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    {plan.name === "Free" && <Star className="h-8 w-8 text-gray-400" />}
                    {plan.name === "Standard" && <Zap className="h-8 w-8 text-blue-500" />}
                    {plan.name === "Pro" && <Crown className="h-8 w-8 text-purple-500" />}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">/one-time</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full py-3 text-lg font-semibold ${
                      plan.name === "Free"
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                        : plan.name === "Standard"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    }`}
                  >
                    {plan.price === 0 ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>

        {/* FAQ Section */}
        <BlurFade delay={0.5}>
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I upgrade later?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes! You can upgrade to any plan at any time. The payment is one-time and you'll get immediate access to the new features.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We currently accept UPI payments. Simply scan the QR code or use your preferred UPI app to complete the payment.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How long does activation take?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  After payment verification (usually 2-4 hours), your account will be upgraded automatically and you'll receive a confirmation email.
                </p>
              </div>
              
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I export my portfolio code?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Code export is available on the Pro plan. You'll get the complete source code to host anywhere you want.
                </p>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  )
} 