"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, QrCode, Smartphone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import BlurFade from "@/components/magicui/blur-fade"

export default function UpgradePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    transactionId: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleUpiDeepLink = () => {
    const upiId = "tirth@upi"
    const amount = "299" // Example amount
    const note = "Portify Pro Upgrade"

    // UPI deep link format
    const upiUrl = `upi://pay?pa=${upiId}&pn=Portify&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`

    // Try to open UPI app, fallback to showing instructions
    window.location.href = upiUrl
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-slate-900 dark:to-emerald-950 flex items-center justify-center p-4">
        <BlurFade delay={0.1}>
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Proof Submitted!</h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Thank you for your submission. We'll verify your payment and activate your Portify Pro account within 24
                hours.
              </p>

              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>What's next?</strong>
                  <br />• We'll verify your transaction
                  <br />• You'll receive a confirmation email
                  <br />• Pro features will be activated automatically
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Portfolio
            </Link>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Upgrade to Portify Pro</h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Scan the QR or pay directly to UPI ID:{" "}
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">tirth@upi</span>
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Instant activation after verification
            </div>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <BlurFade delay={0.2}>
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <QrCode className="h-5 w-5 text-blue-600" />
                  Scan & Pay
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center">
                {/* QR Code Placeholder */}
                <div className="w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-lg">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">QR Code</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">₹299 to tirth@upi</p>
                  </div>
                </div>

                {/* UPI Deep Link Button */}
                <Button
                  onClick={handleUpiDeepLink}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  Pay with UPI App
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Opens your preferred UPI app automatically
                </p>
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
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId" className="text-sm font-medium">
                      Transaction ID *
                    </Label>
                    <Input
                      id="transactionId"
                      name="transactionId"
                      type="text"
                      placeholder="Enter UPI transaction ID"
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      required
                      className="h-11"
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

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pro Features Include:</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Custom domain deployment</li>
                    <li>• Advanced template customization</li>
                    <li>• Analytics dashboard</li>
                    <li>• Priority support</li>
                    <li>• Remove Portify branding</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Security Notice */}
        <BlurFade delay={0.4}>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secure payment processing • 24/7 support • Money-back guarantee
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}
