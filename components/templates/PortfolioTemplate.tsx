// components/PortfolioTemplate.tsx
"use client";

import React from "react";

type Resume = {
  name: string;
  title: string;
  summary: string;
  skills?: string[];
  projects?: {
    name: string;
    description: string;
    techStack?: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    years: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }[];
};

export default function PortfolioTemplate({ data }: { data: Resume }) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 text-gray-800 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-black">{data.name}</h1>
        <h2 className="text-xl text-gray-600 mt-2">{data.title}</h2>
      </header>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Summary</h3>
        <p className="text-gray-700">{data.summary}</p>
      </section>

      {data.experience?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Experience</h3>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-6">
              <h4 className="text-lg font-bold">{exp.role}</h4>
              <p className="text-gray-600 italic">{exp.company} • {exp.duration}</p>
              <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                {exp.responsibilities.map((r, j) => (
                  <li key={j}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Education</h3>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-gray-600">{edu.institution} • {edu.years}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.projects?.length > 0 && (
        <section className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Projects</h3>
          {data.projects.map((project, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">{project.name}</p>
              <p className="text-sm text-gray-600">{project.description}</p>
              {project.techStack?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {project.techStack.map((tech, j) => (
                    <span key={j} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
