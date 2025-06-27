"use client";

import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

// ✨ Example parsed data (replace with actual prop or localStorage)
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
      dates: "June 2025"
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
};

export default function Page(data: any) {
  return (
    <main className="flex flex-col min-h-screen space-y-10 px-4 py-10">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold sm:text-5xl xl:text-6xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.title}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <h2 className="text-xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          {/* #className="prose dark:prose-invert text-sm text-muted-foreground" */}
          <Markdown > 
            {DATA.summary}
          </Markdown>
        </BlurFade>
      </section>

      {/* Work */}
      {DATA.work?.length > 0 && (
        <section id="work">
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade key={id} delay={BLUR_FADE_DELAY * 5 + id * 0.05}>
              <ResumeCard
                key={work.company}
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </section>
      )}

      {/* Education */}
      {DATA.education?.length > 0 && (
        <section id="education">
          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>
          {DATA.education.map((edu, id) => (
            <BlurFade key={id} delay={BLUR_FADE_DELAY * 7 + id * 0.05}>
              <ResumeCard
                key={edu.school}
                href={edu.href}
                logoUrl={edu.logoUrl}
                altText={edu.school}
                title={edu.school}
                subtitle={edu.degree}
                period={`${edu.start} - ${edu.end}`}
              />
            </BlurFade>
          ))}
        </section>
      )}

      {/* Skills */}
      {DATA.skills?.length > 0 && (
        <section id="skills">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>
          <div className="flex flex-wrap gap-2 mt-2">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={id} delay={BLUR_FADE_DELAY * 9 + id * 0.05}>
                <Badge>{skill}</Badge>
              </BlurFade>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {DATA.Certificates?.length > 0 && (
        <section id="certificates">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <h2 className="text-xl font-bold">Certificates</h2>
          </BlurFade>
          {DATA.Certificates.map((cert, id) => (
            <BlurFade key={cert.key} delay={BLUR_FADE_DELAY * 11 + id * 0.05}>
              <ResumeCard
                key={cert.key}
                href={cert.href}
                logoUrl={cert.logoUrl}
                altText={cert.subtitle}
                title={cert.title}
                subtitle={cert.site}
                period={cert.time}
              />
            </BlurFade>
          ))}
        </section>
      )}

      {/* Projects */}
      {DATA.projects?.length > 0 && (
        <section id="projects">
          <BlurFade delay={BLUR_FADE_DELAY * 12}>
            <h2 className="text-xl font-bold">Projects</h2>
          </BlurFade>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {DATA.projects.map((project, id) => (
              <BlurFade key={id} delay={BLUR_FADE_DELAY * 13 + id * 0.05}>
                <ProjectCard
                  key={project.title}
                  href={project.href}
                  title={project.title}
                  description={project.description}
                  dates={project.dates}
                  tags={project.technologies}
                />
              </BlurFade>
            ))}
          </div>
        </section>
      )}

      {/* Hackathons */}
      {DATA.hackathons?.length > 0 && (
        <section id="hackathons">
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <h2 className="text-xl font-bold">Hackathons</h2>
          </BlurFade>
          <ul className="border-l divide-y divide-dashed">
            {DATA.hackathons.map((hack, id) => (
              <BlurFade key={id} delay={BLUR_FADE_DELAY * 15 + id * 0.05}>
                <HackathonCard {...hack} />
              </BlurFade>
            ))}
          </ul>
        </section>
      )}

      {/* Contact */}
      <section id="contact">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <h2 className="text-xl font-bold">Contact</h2>
        </BlurFade>
        <p className="text-center text-muted-foreground">
          Drop me a message on{" "}
          <Link
            href={DATA.contact.social.X.url}
            className="text-blue-600 hover:underline"
          >
            Twitter
          </Link>
          !
        </p>
      </section>
    </main>
  );
}
