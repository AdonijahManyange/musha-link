import Navbar from "@/components/layout/Navbar";
import SavedListingsContent from "./SavedListingsContent";

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <SavedListingsContent />
    </main>
  );
}