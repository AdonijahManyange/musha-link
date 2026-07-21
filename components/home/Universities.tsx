import UniversityCard from "@/components/ui/UniversityCard";

export default function Universities() {
  return (
    <section
      id="universities"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Browse by University
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Find accommodation near Zimbabwe's leading universities.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-xl bg-red-200 p-6">
            Test Card
        </div>

        <div className="rounded-xl bg-red-200 p-6">Card 1</div>
        <div className="rounded-xl bg-red-200 p-6">Card 2</div>
        <div className="rounded-xl bg-red-200 p-6">Card 3</div>
        <div className="rounded-xl bg-red-200 p-6">Card 4</div>
        <div className="rounded-xl bg-red-200 p-6">Card 5</div>
        <div className="rounded-xl bg-red-200 p-6">Card 6</div>

        </div>
      </div>
    </section>
  );
}