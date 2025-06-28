"use client"

import { QRCodeCanvas } from "qrcode.react"

type Props = {
  upiId: string
  name?: string
  amount?: number
  note?: string
}
// `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`
export default function UpiQRCode({ upiId, name = "Portify", amount = 299, note = "Portify Pro Upgrade" }: Props) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR&tn=${note}`

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <QRCodeCanvas 
          value={upiUrl} 
          size={140} 
          level="M"
          includeMargin={true}
          style={{ borderRadius: '8px' }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          ₹{amount}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {upiId}
        </p>
      </div>
    </div>
  )
}
