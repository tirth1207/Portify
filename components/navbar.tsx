import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
const DATA = {
  name: "John W. Smith",
  title: "Early Childhood Development and Special Needs Care Professional",
  summary:
    "Four years experience in early childhood development with a diverse background in the care of special needs children and adults.",
  skills: ["Child Psychology", "Special Needs Care", "Team Leadership"],
  projects: [
    {
      title: "Inclusive Learning Platform",
      description: "An accessible app for children with learning disabilities",
      technologies: ["React", "Tailwind", "Node.js"],
      href: "#",
    },
  ],
  avatarUrl: "/avatar.png", // placeholder
  initials: "JS",
  work: [
    {
      company: "The Wesley Center",
      title: "Counseling Supervisor",
      logoUrl: "/wesley.png",
      start: "1999",
      end: "2002",
      href: "#",
      badges: ["Full-time"],
      description:
        "Determined work placement for 150 special needs adult clients. Managed 25 volunteer workers.",
    },
  ],
  education: [
    {
      school: "University of Arkansas",
      degree: "BS in Early Childhood Development",
      start: "1995",
      end: "1999",
      logoUrl: "/ua.png",
      href: "#",
    },
  ],
  Certificates: [
    {
      key: "cert1",
      title: "Special Needs Education",
      site: "Coursera",
      time: "2020",
      subtitle: "Certified Educator",
      logoUrl: "/cert.png",
      href: "#",
    },
  ],
  hackathons: [
    {
      title: "EduHack 2021",
      description: "Built a learning aid for dyslexic students",
      location: "New York",
      dates: "May 2021",
      image: "/hackathon.png",
      links: [],
    },
  ],
  contact: {
    social: {
      X: { url: "https://twitter.com/example" },
    },
  },
  navbar: {
    
  }
};
export default function Navbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
        {/* {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12"
                  )}
                >
                  <item.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))} */}
        <Separator orientation="vertical" className="h-full" />
        {/* {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))} */}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}
