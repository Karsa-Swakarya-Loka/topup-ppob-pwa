import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}

export function SectionHeading({
  title,
  subtitle,
  href,
  actionLabel = "Lihat Semua",
}: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-deep-pine md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-xs font-semibold text-karyalo-green hover:underline md:text-sm shrink-0"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
