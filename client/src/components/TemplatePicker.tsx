"use client";

import { useState } from "react";

export type TemplateType = "simple" | "academic" | "professional" | "code" | "modern" | "minimal" | "invoice" | "resume" | "resume_modern" | "resume_executive" | "creative" | "letter" | "report" | "contract" | "proposal";

interface Template {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  cssStyles: string;
  htmlSnippet: string;
  icon: string;
}

const templates: Template[] = [
  {
    id: "simple",
    name: "Simple",
    description: "Clean and minimal design for everyday documents",
    preview: "Perfect for quick notes, memos, and general content",
    icon: "📄",
    cssStyles: `
      body { font-family: system-ui, sans-serif; color: #334155; }
      h1 { font-size: 2rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem; }
      h2 { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin: 1.5rem 0 0.75rem; }
      p { font-size: 1rem; line-height: 1.7; margin-bottom: 1rem; }
    `,
    htmlSnippet: `
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "academic",
    name: "Academic",
    description: "Formal layout for research papers and academic work",
    preview: "Citations, footnotes, and structured formatting",
    icon: "🎓",
    cssStyles: `
      body { font-family: 'Georgia', serif; color: #1e293b; }
      h1 { font-size: 2.5rem; font-weight: 700; color: #0f172a; 
           border-bottom: 2px solid #cbd5e1; padding-bottom: 0.75rem; margin-bottom: 1.5rem; }
      h2 { font-size: 1.75rem; font-weight: 600; color: #1e293b; margin: 2rem 0 1rem; }
      p { font-size: 1rem; line-height: 1.8; text-align: justify; margin-bottom: 1.25rem; }
      blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; 
                   font-style: italic; color: #475569; }
    `,
    htmlSnippet: `
      <div style="padding: 3rem; max-width: 750px; margin: 0 auto;">
        <h1 style="text-align: center;">{{title}}</h1>
        <p style="text-align: center; font-style: italic; color: #64748b;">{{author}}</p>
        <div style="margin-top: 2rem;">{{content}}</div>
      </div>
    `,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate style for business documents and reports",
    preview: "Executive summaries, proposals, and client reports",
    icon: "💼",
    cssStyles: `
      body { font-family: 'Inter', sans-serif; color: #334155; 
             background: linear-gradient(to bottom right, #f8fafc, #ffffff); }
      h1 { font-size: 2rem; font-weight: 700; color: #ffffff; 
           background: #0f172a; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
      h2 { font-size: 1.5rem; font-weight: 600; color: #0f172a; 
           border-left: 4px solid #0f172a; padding-left: 1rem; margin: 1.5rem 0 0.75rem; }
      p { font-size: 1rem; line-height: 1.7; margin-bottom: 1rem; }
      .highlight { background: #fef3c7; padding: 1rem; border-radius: 0.5rem; 
                   border-left: 4px solid #f59e0b; }
    `,
    htmlSnippet: `
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div class="highlight">
          <strong>Executive Summary:</strong> {{summary}}
        </div>
        <div style="margin-top: 2rem;">{{content}}</div>
      </div>
    `,
  },
  {
    id: "code",
    name: "Code Documentation",
    description: "Perfect for technical documentation and code samples",
    preview: "Syntax highlighting, monospace fonts, and code blocks",
    icon: "💻",
    cssStyles: `
      body { font-family: 'Segoe UI', sans-serif; color: #1e293b; }
      h1 { font-size: 2rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem; }
      h2 { font-size: 1.5rem; font-weight: 600; color: #475569; margin: 1.5rem 0 0.75rem; }
      p { font-size: 1rem; line-height: 1.7; margin-bottom: 1rem; }
      code { font-family: 'Consolas', 'Monaco', monospace; background: #f1f5f9; 
             padding: 0.25rem 0.5rem; border-radius: 0.25rem; color: #dc2626; }
      pre { font-family: 'Consolas', 'Monaco', monospace; background: #0f172a; 
            color: #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
    `,
    htmlSnippet: `
      <div style="padding: 2rem; max-width: 850px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Vibrant and punchy design for brochures and portfolios",
    preview: "Bold colors, large headings, and dynamic layouts",
    icon: "✨",
    cssStyles: `
      body { font-family: 'Outfit', sans-serif; color: #1e293b; }
      h1 { font-size: 3.5rem; font-weight: 900; color: #4f46e5; margin-bottom: 1.5rem; letter-spacing: -0.05em; }
      h2 { font-size: 2rem; font-weight: 700; color: #1e293b; margin-top: 2rem; }
      p { font-size: 1.125rem; line-height: 1.6; color: #475569; }
    `,
    htmlSnippet: `
      <div style="padding: 4rem; max-width: 900px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div style="height: 4px; width: 60px; background: #4f46e5; margin-bottom: 2rem;"></div>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean and spacing-focused layout",
    preview: "Focus on white space and typography",
    icon: "⚪",
    cssStyles: `
      body { font-family: 'Inter', sans-serif; color: #000; font-weight: 300; }
      h1 { font-size: 1.5rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 3rem; text-align: center; }
      p { font-size: 0.9rem; line-height: 2; margin-bottom: 2rem; }
    `,
    htmlSnippet: `
      <div style="padding: 5rem; max-width: 700px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Clean and structured design for billing",
    preview: "Tables, totals, and professional billing layout",
    icon: "🧾",
    cssStyles: `
      body { font-family: 'Helvetica', sans-serif; color: #333; }
      h1 { font-size: 1.5rem; color: #1a1a1a; margin-bottom: 2rem; }
    `,
    htmlSnippet: `
      <div style="padding: 3rem; max-width: 800px; margin: 0 auto;">
        <h1>INVOICE - {{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "resume",
    name: "Resume",
    description: "Professional layout for career documents",
    preview: "Skills, experience, and contact info focus",
    icon: "👤",
    cssStyles: `
      body { font-family: 'Calibri', sans-serif; color: #2d3748; }
      h1 { font-size: 2.25rem; font-weight: 700; color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1rem; }
    `,
    htmlSnippet: `
      <div style="padding: 3rem; max-width: 850px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "resume_modern",
    name: "Modern Resume",
    description: "Contemporary design with sidebar and high readability",
    preview: "Modern typography and sleek contact section",
    icon: "🤵",
    cssStyles: `
      body { font-family: 'Inter', sans-serif; color: #1e293b; background: white; }
      .container { display: flex; min-height: 100vh; }
      .sidebar { width: 30%; background: #f8fafc; padding: 2rem; border-right: 1px solid #e2e8f0; }
      .main { width: 70%; padding: 2rem; }
      h1 { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-top: 0; }
      h2 { font-size: 1.25rem; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    `,
    htmlSnippet: `
      <div class="container">
        <div class="sidebar">
          <div style="width: 80px; height: 80px; background: #e2e8f0; border-radius: 50%; margin-bottom: 1.5rem;"></div>
          <div style="font-size: 0.875rem; color: #64748b;">{{contact_info}}</div>
        </div>
        <div class="main">
          <h1>{{title}}</h1>
          <p style="font-size: 1.125rem; color: #64748b;">{{subtitle}}</p>
          <div>{{content}}</div>
        </div>
      </div>
    `,
  },
  {
    id: "resume_executive",
    name: "Executive Resume",
    description: "Luxurious and authoritative layout for senior roles",
    preview: "Classic serif fonts with elegant gold/navy accents",
    icon: "🕴️",
    cssStyles: `
      body { font-family: 'Garamond', serif; color: #1a202c; }
      header { text-align: center; border-bottom: 3px solid #1a365d; padding-bottom: 1.5rem; margin-bottom: 2rem; }
      h1 { font-size: 2.75rem; font-weight: 500; color: #1a365d; margin: 0; }
      h2 { font-size: 1.5rem; font-weight: 600; color: #744210; margin-top: 2rem; border-left: 4px solid #1a365d; padding-left: 1rem; }
      p { line-height: 1.6; }
    `,
    htmlSnippet: `
      <div style="padding: 4rem; max-width: 850px; margin: 0 auto;">
        <header>
          <h1>{{title}}</h1>
          <div style="color: #4a5568; margin-top: 0.5rem;">{{subtitle}}</div>
        </header>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Artistic layout with unique color accents",
    preview: "Good for design briefs and artistic portfolios",
    icon: "🎨",
    cssStyles: `
      body { font-family: 'Montserrat', sans-serif; background: #fffcf0; color: #1a202c; }
      h1 { font-size: 3rem; color: #e53e3e; text-shadow: 2px 2px #feb2b2; }
    `,
    htmlSnippet: `
      <div style="padding: 4rem; max-width: 800px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "letter",
    name: "Letter",
    description: "Classic personal or business letter format",
    preview: "Sender/Recipient blocks and formal sign-offs",
    icon: "✉️",
    cssStyles: `
      body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
    `,
    htmlSnippet: `
      <div style="padding: 4rem; max-width: 650px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div style="margin-top: 2rem;">{{content}}</div>
      </div>
    `,
  },
  {
    id: "report",
    name: "Report",
    description: "Structured corporate report with table of contents style",
    preview: "Project summaries and milestone tracking",
    icon: "📊",
    cssStyles: `
      body { font-family: 'Arial', sans-serif; color: #333; }
      h1 { color: #2c5282; border-bottom: 2px solid #2c5282; padding-bottom: 0.5rem; }
    `,
    htmlSnippet: `
      <div style="padding: 3rem; max-width: 850px; margin: 0 auto;">
        <h1>REPORT: {{title}}</h1>
        <div>{{content}}</div>
      </div>
    `,
  },
  {
    id: "contract",
    name: "Contract",
    description: "Formal legal document layout",
    preview: "Clauses, terms, and signature lines",
    icon: "🖋️",
    cssStyles: `
      body { font-family: 'Garamond', serif; font-size: 11pt; color: #000; }
      h1 { font-size: 14pt; text-align: center; text-transform: uppercase; font-weight: bold; }
    `,
    htmlSnippet: `
      <div style="padding: 4rem; max-width: 700px; margin: 0 auto;">
        <h1>{{title}}</h1>
        <div style="margin-top: 3rem;">{{content}}</div>
        <div style="margin-top: 5rem; display: flex; justify-content: space-between;">
          <div style="border-top: 1px solid #000; width: 200px; text-align: center;">Signature</div>
          <div style="border-top: 1px solid #000; width: 200px; text-align: center;">Date</div>
        </div>
      </div>
    `,
  },
  {
    id: "proposal",
    name: "Business Proposal",
    description: "Compelling layout for client proposals and pitches",
    preview: "Executive summary, scope, and pricing sections",
    icon: "📋",
    cssStyles: `
      body { font-family: 'Inter', sans-serif; color: #1e293b; }
      h1 { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
      h2 { font-size: 1.25rem; font-weight: 700; color: #4f46e5; margin-top: 2.5rem; 
           padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
      p { font-size: 1rem; line-height: 1.7; color: #475569; }
      .highlight { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
                   color: white; padding: 1.5rem; border-radius: 1rem; margin: 1.5rem 0; }
    `,
    htmlSnippet: `
      <div style="padding: 3rem; max-width: 850px; margin: 0 auto;">
        <div class="highlight">
          <h1 style="color: white; margin: 0;">{{title}}</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 0.5rem 0 0;">{{subtitle}}</p>
        </div>
        <div>{{content}}</div>
      </div>
    `,
  },
];

interface TemplatePickerProps {
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
  className?: string;
}

export default function TemplatePicker({
  selected,
  onSelect,
  className = "",
}: TemplatePickerProps) {
  const [hoveredId, setHoveredId] = useState<TemplateType | null>(null);

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Choose Template
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Select a template that matches your document style
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => {
          const isSelected = selected === template.id;
          const isHovered = hoveredId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all ${isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                : "border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-lg"
                }`}
            >
              {/* Icon */}
              <div
                className={`mb-3 text-3xl transition-transform ${isHovered ? "scale-110" : ""
                  }`}
              >
                {template.icon}
              </div>

              {/* Template Name */}
              <h4
                className={`mb-2 text-base font-semibold ${isSelected ? "text-white" : "text-slate-900"
                  }`}
              >
                {template.name}
              </h4>

              {/* Description */}
              <p
                className={`mb-3 text-xs leading-relaxed ${isSelected ? "text-slate-200" : "text-slate-600"
                  }`}
              >
                {template.description}
              </p>

              {/* Preview Text */}
              <p
                className={`text-[10px] leading-tight ${isSelected ? "text-slate-300" : "text-slate-500"
                  }`}
              >
                {template.preview}
              </p>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute right-3 top-3 rounded-full bg-amber-300 p-1">
                  <svg
                    className="h-3 w-3 text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Template Details */}
      {selected && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/50 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <strong className="text-slate-900">
                {templates.find((t) => t.id === selected)?.name}
              </strong>{" "}
              template selected. Your PDF will be formatted accordingly.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Export templates and helper functions
export { templates };

export function getTemplateById(id: TemplateType): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function applyTemplate(
  content: string,
  templateId: TemplateType,
  variables: Record<string, string> = {}
): string {
  const template = getTemplateById(templateId);
  if (!template) return content;

  let html = template.htmlSnippet;

  // Replace variables
  Object.entries(variables).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  // Add content
  html = html.replace("{{content}}", content);

  // Wrap with styles
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>${template.cssStyles}</style>
      </head>
      <body>${html}</body>
    </html>
  `;
}
