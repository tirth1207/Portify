// app/admin/payments/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Badge } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  async function fetchPayments() {
    const res = await fetch("/api/admin/payments")
    const data = await res.json()
    setPayments(data)
  }

  async function verifyPayment(id: string, userId: string, plan: string) {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId, plan }),
    })

    if (res.ok) {
      const result = await res.json()
      toast({ 
        title: "Payment verified!", 
        description: `User upgraded to ${result.subscriptionTier} plan.`
      })
      fetchPayments()
    } else {
      toast({ title: "Failed to verify", variant: "destructive" })
    }
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pro":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Payment Proofs</h1>
      <div className="space-y-4">
        {payments.length === 0 && <p className="text-sm text-muted-foreground">No pending payments.</p>}
        {payments.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{p.name} ({p.email})</CardTitle>
                {p.plan && (
                  <Badge className={getPlanBadgeColor(p.plan)}>
                    {p.plan}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label>Transaction ID:</Label>
                <Input value={p.transaction_id} readOnly />
              </div>
              {p.amount && (
                <div>
                  <Label>Amount:</Label>
                  <Input value={`₹${p.amount}`} readOnly />
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => verifyPayment(p.id, p.user_id, p.plan)}>
                  <CheckCircle className="w-4 h-4 mr-2" /> 
                  Verify & Upgrade to {p.plan || "Pro"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}