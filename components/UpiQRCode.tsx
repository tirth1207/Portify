"use client"

import { QRCodeCanvas } from "qrcode.react"



type Props = {
  upiId: string
  name?: string
  amount?: number
  note?: string
}
// `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`
export default function UpiQRCode({ upiId, name = "Tirth", amount = 99, note = "Portify Pro" }: Props) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`

  return (
    <div className="flex w-full items-center gap-4 p-5">
      <QRCodeCanvas value={upiUrl} size={150} />
      {/* <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Scan to pay ₹{amount} to <strong>{upiId}</strong>
      </p> */}
    </div>
  )
}
