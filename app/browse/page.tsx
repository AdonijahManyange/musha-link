import { Suspense } from "react";
import BrowseContent from "./BrowseContent";

export default function BrowsePage() {
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