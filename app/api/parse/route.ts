import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); // ✅ works in Node.js runtime

    const data = await pdfParse(buffer);
    const resumeText = data.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "Resume text too short to parse." }, { status: 400 });
    }

    const prompt = `
You are an expert resume parser. Extract structured information from the resume text below.
Return a JSON in the following format:

{
  "name": "Full Name",
  "title": "Professional Title",
  "summary": "Short bio",
  "skills": ["Skill 1", "Skill 2"],
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does",
      "techStack": ["Tech 1", "Tech 2"]
    }
  ],
  "education": [
    {
      "institution": "School Name",
      "degree": "Degree",
      "years": "2019 - 2023"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Role",
      "duration": "Jan 2021 - Dec 2022",
      "responsibilities": ["Task 1", "Task 2"]
    }
  ]
}

Resume Text:
"""
${resumeText}
"""
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or 2.5 if you’ve upgraded
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // Safe parse
    const jsonStart = content.indexOf("{");
    if (jsonStart === -1) throw new Error("Gemini response is malformed");

    const json = content.slice(jsonStart).replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(json);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Resume parsing failed:", err.message);
    return NextResponse.json({
      error: "Resume parsing failed.",
      details: err.message ?? err.toString(),
    }, { status: 500 });
  }
}
