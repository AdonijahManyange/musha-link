import { BadgeCheck } from "lucide-react";

type StudentVerificationBadgeProps = {
  method: "SCHOOL_EMAIL" | "STUDENT_CARD" | null | undefined;
  compact?: boolean;
  className?: string;
};

export default function StudentVerificationBadge({
  method,
  compact = false,
  className = "",
}: StudentVerificationBadgeProps) {
  const detail = method === "SCHOOL_EMAIL" ? "School email confirmed" : "Student card reviewed";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 ${className}`}
      title={detail}
      aria-label={`Verified student: ${detail}`}
    >
      <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
      {compact ? "Verified student" : detail}
    </span>
  );
}
