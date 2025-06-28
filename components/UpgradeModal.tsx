"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, QrCode, Smartphone, Crown, Zap, Shield, Palette, BarChart3, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import UpiQRCode from "./UpiQRCode"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
  onUpgradeComplete?: () => void
}

export default function UpgradeModal({ isOpen, onClose, feature, onUpgradeComplete }: UpgradeModalProps) {
  const [step, setStep] = useState<"features" | "payment" | "success">("features")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    transactionId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [showQr, setShowQr] = useState(false)


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

    const res = await fetch("/api/payment-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    setStep("success")
    setIsSubmitting(false)

    toast({
      title: "Payment proof submitted!",
      description: "We'll verify your payment and activate Pro within 24 hrs.",
    })
  }


  const handleUpiDeepLink = () => {
    const upiId = "rathod2304hetal@okaxis"
    const amount = "299"
    const note = "Portify Pro Upgrade"

    const upiUrl = `upi://pay?pa=${upiId}&pn=Portify&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
    window.location.href = upiUrl
    setShowQr(true)
  }

  const handleClose = () => {
    setStep("features")
    setFormData({ name: "", email: "", transactionId: "" })
    onClose()
  }

  const handleSuccess = () => {
    onUpgradeComplete?.()
    handleClose()
  }

  const proFeatures = [
    {
      icon: Crown,
      title: "Custom Domain Deployment",
      description: "Deploy to your own custom domain (yourname.com)",
      highlight: feature === "deploy",
    },
    {
      icon: Palette,
      title: "Advanced Customization",
      description: "Full control over colors, fonts, and layouts",
      highlight: feature === "customization",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track visitors, views, and engagement metrics",
      highlight: feature === "analytics",
    },
    {
      icon: Shield,
      title: "Remove Branding",
      description: "Clean portfolio without Portify watermarks",
      highlight: feature === "branding",
    },
    {
      icon: Zap,
      title: "Priority Support",
      description: "24/7 premium support and faster response times",
      highlight: false,
    },
    {
      icon: QrCode,
      title: "Advanced Templates",
      description: "Access to exclusive premium template designs",
      highlight: feature === "templates",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {step === "features" && (
          <>
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">Upgrade to Portify Pro</DialogTitle>
                    <DialogDescription className="text-base">
                      {feature === "deploy"
                        ? "Custom domain deployment requires Portify Pro"
                        : "Unlock premium features and take your portfolio to the next level"}
                    </DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6">
              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl px-6 py-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">₹299</span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">one-time</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Lifetime access • No recurring fees • 30-day money-back guarantee
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {proFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      feature.highlight
                        ? "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950 ring-2 ring-purple-200 dark:ring-purple-800"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          feature.highlight
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {feature.title}
                          {feature.highlight && (
                            <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep("payment")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setStep("features")}>
                  ←
                </Button>
                <div>
                  <DialogTitle className="text-xl">Complete Your Upgrade</DialogTitle>
                  <DialogDescription>
                    Scan QR or pay to UPI ID: <span className="font-mono font-semibold">rathod2304hetal@okaxis</span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* QR Code Section */}
                <Card className="border-0 bg-gray-50 dark:bg-slate-800">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5 text-purple-600" />
                      Scan & Pay ₹299
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      {showQr ? (
                        <UpiQRCode upiId="rathod2304hetal@okaxis" amount={299} />
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 px-4 text-center">
                          Click "Pay with UPI App" to show QR code if the app doesn't open.
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleUpiDeepLink}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Pay with UPI App
                    </Button>
                  </CardContent>
                </Card>

                {/* Payment Form */}
                <Card className="border-0 bg-gray-50 dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Submit Payment Proof</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
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
                          placeholder="UPI transaction ID"
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.transactionId}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
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
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Submitted!</h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We'll verify your payment and activate Pro features within 24 hours. You'll receive a confirmation email
              once activated.
            </p>

            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>What happens next?</strong>
                <br />• Payment verification (usually within 2-4 hours)
                <br />• Email confirmation with Pro activation
                <br />• All premium features unlocked automatically
              </p>
            </div>

            <Button onClick={handleSuccess} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Continue Building
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
