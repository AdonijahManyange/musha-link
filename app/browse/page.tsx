import { Suspense } from "react";
import BrowseContent from "./BrowseContent";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(await searchParams)) {
      if (typeof value === "string") params.set(key, value);
    }
    const callbackUrl = `/browse${params.size ? `?${params.toString()}` : ""}`;
    redirect(`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-6 py-16">
          <div className="h-[450px] animate-pulse rounded-2xl bg-slate-200" />
        </main>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
