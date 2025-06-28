import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import PortfolioTemplate from "@/components/templates/PortfolioTemplate"
import MinimalTemplate from "@/components/templates/MinimalTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import CreativeTemplate from "@/components/templates/CreativeTemplate"
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate"
import TechTemplate from "@/components/templates/TechTemplate"
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate"
import ArtisticTemplate from "@/components/templates/ArtisticTemplate"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// type PageProps = {
//   params: Promise<{
//     subdomain: string
//   }>
// }

type PageProps = {
  params: { subdomain: string }
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = params;

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("subdomain", subdomain)
    .eq("is_deployed", true)
    .single();

  if (error || !portfolio) {
    notFound();
  }

  const portfolioData = {
    name: portfolio.name,
    title: portfolio.title || portfolio.name,
    summary: portfolio.summary || "",
    skills: portfolio.skills || [],
    projects: portfolio.projects || [],
    education: portfolio.education || [],
    experience: portfolio.experience || [],
    contact: portfolio.contact || {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      twitter: "",
      website: ""
    }
  };

  const props = { data: portfolioData, editMode: false };

  const templateMap = {
    MinimalTemplate: MinimalTemplate,
    ModernTemplate: ModernTemplate,
    CreativeTemplate: CreativeTemplate,
    ProfessionalTemplate: ProfessionalTemplate,
    TechTemplate: TechTemplate,
    ExecutiveTemplate: ExecutiveTemplate,
    ArtisticTemplate: ArtisticTemplate,
    PortfolioTemplate: PortfolioTemplate
  };

  const SelectedTemplate =
    typeof portfolio.template === "string" && portfolio.template in templateMap
      ? templateMap[portfolio.template as keyof typeof templateMap]
      : PortfolioTemplate;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <SelectedTemplate {...props} />

      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          className="inline-flex items-center px-3 py-2 bg-black/80 hover:bg-black text-white text-xs rounded-full transition-colors backdrop-blur-sm shadow-lg"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          Create your own
        </a>
      </div>
    </div>
  );
}
