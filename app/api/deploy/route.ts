import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const VERCEL_API = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_API_TOKEN!;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const TEAM_ID = process.env.VERCEL_TEAM_ID; // optional

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { portfolioData, template } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check user's subscription plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    const subscriptionTier = profile?.subscription_tier || "free";
    
    // Check if user can deploy (Standard or Pro plan)
    if (subscriptionTier === "free") {
      return NextResponse.json({ 
        error: "Subdomain deployment requires Standard or Pro plan",
        requiresUpgrade: true 
      }, { status: 403 });
    }

    // Check if subdomain is available
    const sub = genSubdomain(portfolioData.name);
    const domainName = `${sub}.portfoliobuilder.app`;

    // Check if subdomain already exists
    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("subdomain", sub)
      .single();

    if (existingPortfolio) {
      return NextResponse.json({ 
        error: "Subdomain already taken. Please choose a different name." 
      }, { status: 400 });
    }

    // 1. Add domain via Vercel API
    try {
      await axios.post(
        `${VERCEL_API}/v9/projects/${PROJECT_ID}/domains${TEAM_ID ? `?teamId=${TEAM_ID}` : ""}`,
        { name: domainName },
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );
    } catch (vercelError: any) {
      if (vercelError.response?.status === 409) {
        return NextResponse.json({ 
          error: "Subdomain already exists. Please choose a different name." 
        }, { status: 400 });
      }
      throw vercelError;
    }

    // 2. Create or update portfolio in database
    const { data: portfolio, error: dbError } = await supabase
      .from("portfolios")
      .upsert({
        user_id: user.id,
        name: portfolioData.name,
        title: portfolioData.title || portfolioData.name,
        summary: portfolioData.summary || "",
        skills: portfolioData.skills || [],
        projects: portfolioData.projects || [],
        education: portfolioData.education || [],
        experience: portfolioData.experience || [],
        template: template,
        subdomain: sub,
        deployment_url: `https://${domainName}`,
        is_deployed: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 });
    }

    // 3. Optionally trigger a redeploy to apply domain
    try {
      await axios.post(
        `${VERCEL_API}/v13/deployments?projectId=${PROJECT_ID}${TEAM_ID ? `&teamId=${TEAM_ID}` : ""}`,
        {},
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );
    } catch (deployError) {
      console.warn("Redeploy trigger failed, but domain was added:", deployError);
    }

    return NextResponse.json({
      success: true,
      deploymentUrl: `https://${domainName}`,
      subdomain: sub,
      status: "live",
      deployedAt: new Date().toISOString(),
      template: template,
      portfolioId: portfolio.id,
    });
  } catch (error: any) {
    console.error("Subdomain deploy failed:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Subdomain deploy failed", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
