import type { Metadata } from "next";
import Link from "next/link";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

export const metadata: Metadata = {
  title: "Security & Privacy | MushaLink",
  description:
    "Learn how MushaLink approaches website security, protects user information, and handles security concerns.",
  alternates: {
    canonical: "https://mushalink.com/security",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    title: "1. Our Commitment to Security",
    content: (
      <>
        <p>
          At MushaLink, protecting our users and the information they share
          with our platform is important to us. We take reasonable steps to
          protect our website, user accounts, and information against
          unauthorized access, misuse, loss, and disclosure.
        </p>
        <p>
          Security is an ongoing responsibility. We continue to review and
          improve our practices as the platform develops.
        </p>
      </>
    ),
  },
  {
    title: "2. Secure Website Connections",
    content: (
      <>
        <p>
          MushaLink uses HTTPS to establish encrypted connections between
          supported browsers and our website. HTTPS helps protect information
          while it is transmitted over the internet.
        </p>
        <p>
          Always check that you are visiting the official MushaLink website
          and that your browser shows a secure connection before submitting
          information.
        </p>
        <p>
          If your browser displays a security or certificate warning, do not
          bypass the warning or continue submitting personal information.
          Contact us so we can investigate.
        </p>
      </>
    ),
  },
  {
    title: "3. Account and Information Protection",
    content: (
      <>
        <p>
          We use technical and organizational measures intended to protect
          information handled through MushaLink. Depending on the service and
          information involved, these measures may include:
        </p>
        <ul>
          <li>Secure website connections.</li>
          <li>Authentication and account-access controls.</li>
          <li>Restricted access to platform information.</li>
          <li>Security monitoring and application logging.</li>
          <li>Controls around access to verification information.</li>
        </ul>
        <p>
          No online service can guarantee absolute security. We work to reduce
          risks and address security concerns when they arise.
        </p>
      </>
    ),
  },
  {
    title: "4. Third-Party Service Providers",
    content: (
      <>
        <p>
          MushaLink relies on external technology providers to support parts
          of its operation, including hosting, database functionality,
          authentication, identity verification, and service notifications.
        </p>
        <p>
          These providers may process information on our behalf or provide
          services directly to users. Their handling of information is also
          subject to their applicable terms, privacy policies, and service
          arrangements.
        </p>
        <p>
          We aim to use third-party services appropriately and consider
          security when selecting and configuring the services used by the
          platform.
        </p>
      </>
    ),
  },
  {
    title: "5. Protecting Your Account",
    content: (
      <>
        <p>You can help protect your MushaLink account by:</p>
        <ul>
          <li>Using a strong, unique password.</li>
          <li>Keeping your login credentials private.</li>
          <li>Signing out when using a shared device.</li>
          <li>Avoiding suspicious links and unexpected requests.</li>
          <li>Contacting us if you notice activity you do not recognize.</li>
        </ul>
        <p>
          MushaLink will not ask you to disclose your password through
          ordinary support messages.
        </p>
      </>
    ),
  },
  {
    title: "6. Reporting a Security Concern",
    content: (
      <>
        <p>
          If you discover a potential security vulnerability, suspicious
          activity, unauthorized access, or another security concern involving
          MushaLink, please contact our support team.
        </p>
        <p>
          When reporting an issue, include a description of what happened,
          the affected page or feature, and the approximate time you noticed
          it. Screenshots may also help us investigate.
        </p>
        <p>
          Please do not attempt to access another person's account, retrieve
          private information, disrupt the platform, or publicly disclose
          suspected vulnerabilities before giving us an opportunity to
          investigate.
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          <a
            href="tel:+14697458913"
            className="font-semibold text-brand-blue hover:underline"
          >
            +1 (469) 745-8913
          </a>
        </p>
        <p>
          <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/14697458913"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-blue hover:underline"
          >
            Contact MushaLink Support
          </a>
        </p>
      </>
    ),
  },
  {
    title: "7. Privacy and Personal Information",
    content: (
      <>
        <p>
          Security and privacy are closely connected. We aim to handle
          personal information responsibly and use it for purposes connected
          to operating and improving MushaLink.
        </p>
        <p>
          For details about the information we collect, how it is used,
          circumstances in which it may be shared, and applicable privacy
          requests, please read our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-brand-blue hover:underline"
          >
            Privacy Policy
          </Link>.
        </p>
      </>
    ),
  },
  {
    title: "8. Security Updates",
    content: (
      <>
        <p>
          As MushaLink evolves, we may update our security practices and this
          page to reflect changes to the platform, our services, or applicable
          requirements.
        </p>
        <p>
          We encourage users to revisit this page periodically for updates.
        </p>
      </>
    ),
  },
];

export default function SecurityPage() {
  return (
    <PublicSiteLayout>
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-brand-blue hover:underline"
          >
            &larr; Back to MushaLink
          </Link>

          <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">
              MushaLink
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Security & Privacy
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Last updated: October 30, 2026
            </p>

            <p className="mt-6 leading-7 text-slate-600">
              Your trust matters to us. Learn how MushaLink approaches website
              security, account protection, and the responsible handling of
              information across our student accommodation platform.
            </p>
          </header>

          <div className="mt-6 space-y-5">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-lg font-bold text-slate-950">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </PublicSiteLayout>
  );
}