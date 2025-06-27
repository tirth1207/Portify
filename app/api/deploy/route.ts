import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const VERCEL_API = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_API_TOKEN!;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const TEAM_ID = process.env.VERCEL_TEAM_ID; // optional

function genSubdomain(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);
}

export async function POST(req: NextRequest) {
  try {
    const { portfolioData, selectedTemplate, userInfo } = await req.json();
    const sub = genSubdomain(portfolioData.name);

    // 1. Add domain via Vercel API
    const domainName = `${sub}.portfoliobuilder.app`;
    await axios.post(
      `${VERCEL_API}/v9/projects/${PROJECT_ID}/domains${TEAM_ID ? `?teamId=${TEAM_ID}` : ""}`,
      { name: domainName },
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );

    // 2. [DNS already set via wildcard CNAME in your dashboard!]

    // 3. Optionally trigger a redeploy to apply domain
    await axios.post(
      `${VERCEL_API}/v13/deployments?projectId=${PROJECT_ID}${TEAM_ID ? `&teamId=${TEAM_ID}` : ""}`,
      {},
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );

    return NextResponse.json({
      success: true,
      url: `https://${domainName}`,
      subdomain: sub,
      status: "live",
      deployedAt: new Date().toISOString(),
      template: selectedTemplate,
    });
  } catch (error: any) {
    console.error("Subdomain deploy failed:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Subdomain deploy failed", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
