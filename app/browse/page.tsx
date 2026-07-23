import { Suspense } from "react";
import BrowseContent from "./BrowseContent";
import Navbar from "@/components/layout/Navbar";

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <BrowseContent />
      </Suspense>
    </main>
  );
}