import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const NAV_FONT: CSSProperties = {
  fontFamily: "'Google Sans', 'Roboto', Arial, sans-serif",
};

type BookRepairLayoutProps = {
  backTo: string;
  children: ReactNode;
  showTitleSection?: boolean;
  title: string;
};

const tabLabels: Record<string, string> = {
  phone: "Phone",
  tablet: "Tablet",
  watch: "Watch",
};

function prettify(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BookRepairLayout({ backTo, children, showTitleSection = true, title }: BookRepairLayoutProps) {
  const { tab, brandSlug, sectionSlug, modelSlug } = useParams();

  const breadcrumbs: Array<{ label: string; to?: string }> = [{ label: "Book a Repair", to: "/book-repair" }];

  if (tab && tabLabels[tab]) {
    breadcrumbs.push({ label: tabLabels[tab], to: `/book-repair/${tab}` });

    if (brandSlug) {
      breadcrumbs.push({
        label: prettify(brandSlug),
        to: `/book-repair/${tab}/${brandSlug}`,
      });

      if (sectionSlug) {
        breadcrumbs.push({
          label: prettify(sectionSlug),
          to: `/book-repair/${tab}/${brandSlug}/${sectionSlug}/models`,
        });
      }

      if (modelSlug) {
        breadcrumbs.push({
          label: prettify(modelSlug),
        });
      }
    }
  }

  const shouldShowCurrentCrumb = breadcrumbs[breadcrumbs.length - 1]?.label !== title;

  if (shouldShowCurrentCrumb) {
    breadcrumbs.push({ label: title });
  }

  return (
    <div className="min-h-screen bg-white" style={NAV_FONT}>
      <div>
        <div className="border-b border-[#e8eaed] bg-white/90 backdrop-blur-sm px-6 py-3 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e8eaed] text-[13px] font-medium text-[#202124] hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
              style={NAV_FONT}
            >
              <ArrowLeft size={15} />
              Back
            </Link>
          </div>
        </div>

        {showTitleSection ? (
          <div className="bg-red-600">
            <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
              <div className="text-center">
                <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-[12px] md:text-[13px]" style={NAV_FONT}>
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                      <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                        {index > 0 ? <ChevronRight size={14} className="text-white/60" /> : null}
                        {crumb.to && !isLast ? (
                          <Link to={crumb.to} className="text-white/70 hover:text-white transition-colors">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className={isLast ? "text-white font-medium" : "text-white/70"}>{crumb.label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <h1 className="text-[30px] md:text-[40px] font-bold text-white leading-tight" style={NAV_FONT}>
                  {title}
                </h1>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="bg-white"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(156, 163, 175, 0.28) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
          {children}
        </div>
      </div>
    </div>
  );
}
