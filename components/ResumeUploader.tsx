// components/ResumeUploader.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    const res = await fetch("/api/parse", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    // 🔐 Store parsed resume in localStorage
    localStorage.setItem("parsedResume", JSON.stringify(result));

    // 🚀 Redirect to /portfolio page
    router.push("/onboarding");
  };

  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      <button
        onClick={handleGetStarted}
        className="mb-6 px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800"
      >
        Get Started
      </button>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />

      {loading && <p className="text-gray-600 mt-4">Parsing your resume... hang tight ⏳</p>}
    </div>
  );
}
