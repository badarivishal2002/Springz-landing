"use client"

import { Suspense } from "react"
import ForgotPasswordForm from "./ForgotPasswordForm"

function ForgotPasswordFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Springz Nutrition</h1>
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
