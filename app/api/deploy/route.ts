import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate subdomain from user's name
const generateSubdomain = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30); // Limit length
};

// Simulate deployment to subdomain
export async function POST(req: NextRequest) {
  try {
    const { portfolioData, selectedTemplate, userInfo } = await req.json();

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

    const subdomain = generateSubdomain(portfolioData.name);
    const deploymentUrl = `https://${subdomain}.portify.co.in`;

    // Check if subdomain already exists
    const { data: existingPortfolio } = await supabase
      .from("portfolios")
      .select("id")
      .eq("subdomain", subdomain)
      .single();

    if (existingPortfolio) {
      return NextResponse.json({ 
        error: "Subdomain already taken. Please choose a different name." 
      }, { status: 400 });
    }

    // Simulate deployment process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // In a real implementation, you would:
    // 1. Create DNS records for the subdomain
    // 2. Deploy the portfolio to a hosting service
    // 3. Set up SSL certificates
    // 4. Store deployment info in database

    // Save portfolio to database
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
        template: selectedTemplate,
        subdomain: subdomain,
        deployment_url: deploymentUrl,
        is_deployed: true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 });
    }

    const deploymentResult = {
      success: true,
      deploymentUrl: deploymentUrl,
      subdomain,
      deployedAt: new Date().toISOString(),
      template: selectedTemplate,
      status: "live",
    };

    return NextResponse.json(deploymentResult);
  } catch (error) {
    console.error("Deployment failed:", error);
    return NextResponse.json({ error: "Deployment failed. Please try again." }, { status: 500 });
  }
}
