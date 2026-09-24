import { ReactNode } from "react";

interface PageHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}

export default function PageHeading({ title, subtitle, align = "left" }: PageHeadingProps) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
      <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
    </div>
  );
}
