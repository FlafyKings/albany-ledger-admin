"use client"

import OfficialForm from "@/components/OfficialForm"

export default function OfficialRegistrationPage() {
  return (
    <div className="min-h-screen bg-[#f2f0e3] flex justify-center">
      <div className="w-full max-w-[1400px] bg-white shadow-lg">
        <OfficialForm mode="register" />
      </div>
    </div>
  )
}
