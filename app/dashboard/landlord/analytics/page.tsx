import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3, Eye, LockKeyhole, MessageCircle, TrendingUp, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RefreshAnalytics from "./RefreshAnalytics";

const eventLabels = [
  { type: "IMPRESSION", label: "Impressions", icon: Eye },
  { type: "VIEW", label: "Listing views", icon: Users },
  { type: "ENQUIRY", label: "Enquiries", icon: MessageCircle },
  { type: "VIEWING_REQUEST", label: "Viewing requests", icon: BarChart3 },
] as const;

export default async function LandlordAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "LANDLORD") redirect("/dashboard");

  const listings = await prisma.listing.findMany({
    where: { landlordId: user.id },
    select: { id: true, title: true, city: true, status: true },
    orderBy: { createdAt: "desc" },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const listingIds = listings.map((listing) => listing.id);
  const [events, conversations, viewingRequests] = listingIds.length
    ? await Promise.all([
        prisma.listingAnalyticsEvent.findMany({
          where: {
            listingId: { in: listingIds },
            createdAt: { gte: thirtyDaysAgo },
            NOT: { type: "VIEW", visitorKey: { startsWith: "page-view:" } },
          },
          select: { listingId: true, type: true, visitorKey: true },
        }),
        prisma.conversation.findMany({
          where: { listingId: { in: listingIds }, createdAt: { gte: thirtyDaysAgo } },
          select: { listingId: true, studentId: true },
        }),
        prisma.viewingRequest.findMany({
          where: { listingId: { in: listingIds }, createdAt: { gte: thirtyDaysAgo } },
          select: { listingId: true, studentId: true },
        }),
      ])
    : [[], [], []];

  type Metric = (typeof eventLabels)[number]["type"];
  const visitorsByListing = new Map<string, Record<Metric, Set<string>>>();
  for (const listing of listings) {
    visitorsByListing.set(listing.id, {
      IMPRESSION: new Set(),
      VIEW: new Set(),
      ENQUIRY: new Set(),
      VIEWING_REQUEST: new Set(),
    });
  }
  for (const event of events) {
    if (!event.visitorKey) continue;
    visitorsByListing.get(event.listingId)?.[event.type].add(event.visitorKey);
  }
  // These source records also include activity created before analytics tracking
  // was enabled, so use them to fill in enquiries and viewing requests.
  for (const conversation of conversations) {
    visitorsByListing.get(conversation.listingId)?.ENQUIRY.add(conversation.studentId);
  }
  for (const request of viewingRequests) {
    visitorsByListing.get(request.listingId)?.VIEWING_REQUEST.add(request.studentId);
  }

  const counts = new Map<string, Record<Metric, number>>();
  for (const [listingId, visitors] of visitorsByListing) {
    counts.set(listingId, {
      IMPRESSION: visitors.IMPRESSION.size,
      VIEW: visitors.VIEW.size,
      ENQUIRY: visitors.ENQUIRY.size,
      VIEWING_REQUEST: visitors.VIEWING_REQUEST.size,
    });
  }
  const totals = Object.fromEntries(eventLabels.map(({ type }) => [
    type,
    [...visitorsByListing.values()].reduce((sum, visitors) => sum + visitors[type].size, 0),
  ])) as Record<Metric, number>;

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard/landlord" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
        <header className="mt-6">
          <p className="text-sm font-medium text-brand-blue dark:text-blue-400">Landlord Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-text-primary">Listing performance</h1>
          <p className="mt-2 text-text-secondary">Activity on your listings over the last 30 days.</p>
          <RefreshAnalytics />
        </header>

        <section aria-label="Activity totals" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventLabels.map(({ type, label, icon: Icon }) => (
            <article key={type} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-sm">{label}</span>
                <Icon size={19} />
              </div>
              <p className="mt-3 text-3xl font-bold text-text-primary">{totals[type]}</p>
            </article>
          ))}
        </section>

        <section className="mt-10" aria-labelledby="advanced-analytics-heading">
          <div className="mb-4">
            <h2 id="advanced-analytics-heading" className="text-xl font-bold text-text-primary">Advanced analytics</h2>
            <p className="mt-1 text-sm text-text-secondary">See what Pro analytics will add to your listing insights.</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div aria-hidden="true" className="pointer-events-none select-none p-5 blur-[5px]">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface-secondary p-5">
                  <div className="flex items-center gap-2 font-semibold text-text-primary"><TrendingUp size={18} /> Views over time</div>
                  <div className="mt-6 flex h-24 items-end gap-2" aria-hidden="true">
                    {[35, 52, 42, 72, 58, 86, 66, 100, 76, 92, 64, 82].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t bg-brand-blue/70" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-text-secondary"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
                </div>
                <div className="rounded-xl border border-border bg-surface-secondary p-5">
                  <div className="font-semibold text-text-primary">Listing conversion</div>
                  <div className="mt-5 space-y-4">
                    {["Listing views → enquiries", "Enquiries → viewing requests"].map((label) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm"><span>{label}</span><span>—%</span></div>
                        <div className="mt-2 h-2 rounded-full bg-border"><div className="h-2 w-2/3 rounded-full bg-brand-blue" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-border bg-surface-secondary p-5">
                <div className="font-semibold text-text-primary">Compare listing performance</div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-text-secondary"><span>Listing</span><span>Views</span><span>Enquiry rate</span><span>Property A</span><span>—</span><span>—%</span></div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/65 p-6 text-center backdrop-blur-[1px]">
              <div className="max-w-md rounded-2xl border border-border bg-surface/95 p-6 shadow-lg">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-brand-blue dark:bg-blue-950/60 dark:text-blue-300"><LockKeyhole size={20} /></div>
                <h3 className="mt-3 text-lg font-bold text-text-primary">Unlock detailed performance insights</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">Pro will include view trends, conversion rates, and comparisons across your listings.</p>
                <Link href="/pricing" className="mt-4 inline-flex rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark">Explore plans</Link>
                <p className="mt-2 text-xs text-text-muted">Pro analytics are coming soon.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold text-text-primary">By listing</h2>
          </div>
          {listings.length ? (
            <div className="divide-y divide-border">
              {listings.map((listing) => {
                const listingCounts = counts.get(listing.id);
                return (
                  <article key={listing.id} className="grid gap-3 px-5 py-5 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(90px,auto))] md:items-center">
                    <div>
                      <h3 className="font-semibold text-text-primary">{listing.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{listing.city} · {listing.status.toLowerCase()}</p>
                    </div>
                    {eventLabels.map(({ type, label }) => (
                      <div key={type} className="flex justify-between gap-3 text-sm md:block">
                        <span className="text-text-secondary md:hidden">{label}</span>
                        <span className="font-semibold text-text-primary">{listingCounts?.[type] ?? 0}</span>
                      </div>
                    ))}
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-text-secondary">You haven’t created any listings yet.</p>
          )}
        </section>
        <p className="mt-4 text-xs leading-5 text-text-secondary">Each visitor is counted once per listing and activity type. Your own visits are excluded. Enquiries and viewing requests include existing records from the last 30 days.</p>
      </div>
    </main>
  );
}
