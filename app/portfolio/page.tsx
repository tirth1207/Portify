"use client";

import { useEffect, useState } from "react";
import PortfolioTemplate from "@/components/templates/PortfolioTemplate";
import Page from "@/components/templates/PortfolioTemplate2";
// import PortfolioClassic from "@/components/templates/TemplateClassic";

export default function PortfolioPage() {
  const [resume, setResume] = useState<any>(null);
  const [template, setTemplate] = useState("minimal");

  useEffect(() => {
    const storedResume = localStorage.getItem("parsedResume");
    const selected = localStorage.getItem("selectedTemplate");
    if (storedResume) setResume(JSON.parse(storedResume));
    if (selected) setTemplate(selected);
  }, []);

  if (!resume) return <p>Loading...</p>;

  switch (template) {
    case "modern":
      return <Page data={resume} />;
    case "classic":
      return <PortfolioTemplate data={resume} />;
    default:
      return <PortfolioTemplate data={resume} />;
  }
}
