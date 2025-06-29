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

    const prompt = `You are an expert AI resume parser with deep understanding of professional resumes, CVs, and career documents. Your task is to extract comprehensive, structured information from the uploaded PDF resume and return ONLY a clean, valid JSON object.

IMPORTANT INSTRUCTIONS:
1. Extract ALL available information from the resume
2. Use the exact JSON structure provided below
3. If information is not available, use empty strings or empty arrays
4. Ensure all dates are in YYYY-MM format when possible
5. Normalize company names, job titles, and institution names
6. Extract skills as individual strings, not categories
7. Include all projects, certifications, awards, and languages mentioned
8. Preserve the original content but clean up formatting

Return ONLY the JSON object in this exact format:

{
  "name": "Full Name",
  "title": "Professional Title or Role",
  "summary": "Professional summary or objective",
  "contact": {
    "email": "email@example.com",
    "phone": "+1-234-567-8900",
    "location": "City, State, Country",
    "website": "https://website.com",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username"
  },
  "skills": [
    "JavaScript", "React", "Node.js", "Python", "Machine Learning"
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Detailed project description",
      "technologies": ["React", "Node.js", "MongoDB"],
      "url": "https://project-url.com",
      "github": "https://github.com/username/project"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "2020-09",
      "endDate": "2024-05",
      "location": "City, State",
      "gpa": "3.8",
      "courses": ["Course 1", "Course 2"],
      "achievements": ["Dean's List", "Honors"]
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "startDate": "2023-01",
      "endDate": "Present",
      "location": "City, State",
      "description": "Overall role description",
      "responsibilities": [
        "Responsibility 1",
        "Responsibility 2",
        "Responsibility 3"
      ],
      "achievements": [
        "Achievement 1",
        "Achievement 2"
      ],
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023-06",
      "url": "https://certificate-url.com",
      "expiryDate": "2025-06"
    }
  ],
  "awards": [
    {
      "title": "Award Title",
      "issuer": "Awarding Organization",
      "date": "2023-12",
      "description": "Award description"
    }
  ],
  "languages": [
    {
      "language": "Language Name",
      "proficiency": "Native/Fluent/Intermediate/Basic"
    }
  ],
  "interests": [
    "Interest 1",
    "Interest 2"
  ],
  "volunteer": [
    {
      "organization": "Organization Name",
      "role": "Volunteer Role",
      "startDate": "2022-01",
      "endDate": "Present",
      "description": "Volunteer work description"
    }
  ],
  "publications": [
    {
      "title": "Publication Title",
      "publisher": "Publisher Name",
      "date": "2023-03",
      "url": "https://publication-url.com"
    }
  ],
  "patents": [
    {
      "title": "Patent Title",
      "patentNumber": "US123456789",
      "date": "2023-01",
      "description": "Patent description"
    }
  ]
}

EXTRACTION GUIDELINES:
- Extract the person's full name from the header or contact section
- Identify their current or most recent professional title
- Capture their professional summary or objective statement
- Extract all contact information including social media profiles
- List all technical skills, programming languages, tools, and technologies
- Include all work experience with detailed responsibilities and achievements
- Capture all educational background including degrees, institutions, and dates
- List all projects with descriptions, technologies used, and links
- Include certifications, awards, and recognitions
- Extract language proficiencies and personal interests
- Include volunteer work, publications, and patents if mentioned

QUALITY STANDARDS:
- Ensure all extracted text is clean and properly formatted
- Remove any resume formatting artifacts or unnecessary symbols
- Normalize dates to consistent format (YYYY-MM when possible)
- Preserve the original meaning and context of all information
- Handle missing information gracefully with empty values
- Ensure the JSON is valid and properly structured

Return ONLY the JSON object without any additional text, markdown formatting, or explanations.`;

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
