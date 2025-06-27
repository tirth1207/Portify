"use client";

import { useRouter } from "next/navigation";

const templates = [
  { name: "Minimal", id: "minimal" },
  { name: "Modern", id: "modern" },
  { name: "Classic", id: "classic" },
];

export default function OnboardingPage() {
  const router = useRouter();

  const handleSelect = (templateId: string) => {
    localStorage.setItem("selectedTemplate", templateId);
    router.push("/portfolio");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Choose a Portfolio Template</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelect(template.id)}
            className="cursor-pointer border p-4 rounded-lg hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{template.name}</h2>
            <p className="text-gray-500 text-sm mt-1">Preview & choose</p>
          </div>
        ))}
      </div>
    </div>
  );
}
