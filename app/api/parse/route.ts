import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

// Retry wrapper for overloaded model errors
async function retryGenerateContent(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  payload: any,
  retries = 3,
  delay = 2000
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await model.generateContent(payload);
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("503") || msg.includes("overloaded")) {
        console.warn(`Gemini overloaded — attempt ${attempt + 1}, retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw new Error("Gemini model is overloaded. Please try again later.");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert resume parser.

Extract structured information from the uploaded PDF resume and return only a clean JSON in the following format:

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
`;

    const result = await retryGenerateContent(model, [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
      { text: prompt },
    ]);

    const raw = result.response.text();

    const jsonStart = raw.indexOf("{");
    if (jsonStart === -1) throw new Error("Malformed Gemini response — no JSON found.");

    const cleaned = raw.slice(jsonStart).replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Resume parsing failed:", err.message);
    return NextResponse.json(
      {
        error: "Resume parsing failed.",
        details: err.message ?? err.toString(),
      },
      { status: 500 }
    );
  }
}
