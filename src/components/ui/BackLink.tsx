import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href?: string;
  label?: string;
}

export default function BackLink({ href = "/", label = "Back" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="island group flex h-12 items-center gap-2 pl-1.5 pr-4 font-display text-[13px] font-medium text-white/60 hover:text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] transition-colors duration-200 group-hover:bg-white/[0.1]">
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </span>
      {label}
    </Link>
  );
}
