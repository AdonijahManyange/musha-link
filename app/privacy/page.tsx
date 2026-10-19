import type { Metadata } from "next";
import Link from "next/link";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | MushaLink",
  description:
    "Learn how MushaLink collects, uses, stores, and protects personal information when you use our Zimbabwean student accommodation platform.",
  alternates: {
    canonical: "https://mushalink.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    title: "1. About this Privacy Policy",
    content: (
      <>
        <p>
          MushaLink is a platform designed to help students find accommodation
          in Zimbabwe and connect with property landlords. This Privacy Policy
          explains how personal information may be collected, used, stored,
          shared, and protected when you visit our website or use our services.
        </p>

        <p>
          By using MushaLink, you acknowledge that your personal information
          will be handled as described in this policy and subject to applicable
          law.
        </p>
      </>
    ),
  },
  {
    title: "2. Information We Collect",
    content: (
      <>
        <p>
          Depending on how you use MushaLink, we may collect the following
          categories of information:
        </p>

        <ul>
          <li>
            <strong>Account information:</strong> name, email address, password
            credentials, account role, and account-related information.
          </li>

          <li>
            <strong>Contact information:</strong> telephone numbers and contact
            details provided through your account or viewing requests.
          </li>

          <li>
            <strong>Student information:</strong> accommodation preferences,
            university-related information, and profile details you choose to
            provide.
          </li>

          <li>
            <strong>Landlord information:</strong> profile details, property
            information, and information submitted during landlord verification.
          </li>

          <li>
            <strong>Verification information:</strong> identity-verification
            results and supporting documents submitted through applicable
            verification processes.
          </li>

          <li>
            <strong>Property information:</strong> listing descriptions,
            property photographs, amenities, location details, rental prices,
            and related information.
          </li>

          <li>
            <strong>Communications:</strong> messages, viewing requests,
            landlord responses, and information you provide when contacting us.
          </li>

          <li>
            <strong>Technical information:</strong> information that may be
            recorded through application logs, security monitoring, and
            essential website operations.
          </li>
        </ul>

        <p>
          Please provide only information that is necessary for your use of
          the platform and avoid submitting unrelated sensitive information.
        </p>
      </>
    ),
  },
  {
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>MushaLink may use personal information to:</p>

        <ul>
          <li>Create and manage user accounts.</li>
          <li>Authenticate users and maintain account security.</li>
          <li>Publish and manage accommodation listings.</li>
          <li>Facilitate communication between students and landlords.</li>
          <li>Submit, manage, and respond to property viewing requests.</li>
          <li>Support landlord identity and property-document verification.</li>
          <li>Send relevant account, security, and service notifications.</li>
          <li>
            Detect abuse, investigate suspicious activity, and protect users.
          </li>
          <li>Maintain, troubleshoot, and improve the platform.</li>
          <li>Meet applicable legal and regulatory obligations.</li>
        </ul>

        <p>
          We aim to use information only for purposes that are relevant to
          operating and improving MushaLink, consistent with applicable law.
        </p>
      </>
    ),
  },
  {
    title: "4. Identity Verification and Third-Party Services",
    content: (
      <>
        <p>
          MushaLink uses third-party services to support parts of its
          operation. These services may process information necessary to
          provide their respective functions.
        </p>

        <p>
          <strong>Didit:</strong> Landlord identity verification may be
          facilitated by Didit. Information submitted during a verification
          process may be processed by Didit under its applicable privacy terms
          and the configuration of the verification service.
        </p>

        <p>
          <strong>Supabase:</strong> MushaLink uses Supabase for database and
          storage functionality. Information stored through these services may
          include account-related records, property information, and documents
          submitted through the platform.
        </p>

        <p>
          <strong>Authentication services:</strong> MushaLink may use
          authentication infrastructure or third-party identity providers to
          authenticate users. The information processed depends on the
          authentication method you use.
        </p>

        <p>
          Third-party services operate under their own applicable terms and
          privacy policies. We encourage users to review those policies when
          interacting with external verification or authentication services.
        </p>
      </>
    ),
  },
  {
    title: "5. How Information Is Shared",
    content: (
      <>
        <p>
          We may share relevant information in the following circumstances:
        </p>

        <ul>
          <li>
            <strong>Between students and landlords:</strong> information
            necessary to facilitate accommodation enquiries and viewing
            requests may be shared with the relevant party.
          </li>

          <li>
            <strong>With service providers:</strong> information may be
            processed by providers that support hosting, storage,
            authentication, identity verification, notifications, and platform
            operations.
          </li>

          <li>
            <strong>For safety and legal reasons:</strong> information may be
            disclosed when reasonably necessary to address security incidents,
            investigate abuse, protect users, or comply with applicable law.
          </li>

          <li>
            <strong>With your direction or consent:</strong> information may be
            shared when you request or authorize the disclosure.
          </li>
        </ul>

        <p>
          MushaLink does not make a promise that information will never be
          shared. Any sharing should be limited to relevant purposes and
          handled in accordance with applicable legal requirements.
        </p>
      </>
    ),
  },
  {
    title: "6. Storage and Security",
    content: (
      <>
        <p>
          MushaLink uses technical and organizational measures intended to
          protect information against unauthorized access, loss, misuse, and
          disclosure. These measures may include access controls, secure
          connections, and restricted access to verification documents.
        </p>

        <p>
          No website, storage system, or internet transmission can be
          guaranteed to be completely secure. Users should protect their
          account credentials and notify us if they suspect unauthorized
          access to their accounts.
        </p>
      </>
    ),
  },
  {
    title: "7. Data Retention",
    content: (
      <>
        <p>
          Personal information is retained for as long as reasonably necessary
          for the purposes described in this policy, including providing
          services, maintaining account records, addressing disputes, preventing
          abuse, and satisfying applicable legal obligations.
        </p>

        <p>
          Retention periods may differ depending on the type of information,
          its purpose, applicable requirements, and whether the information
          remains necessary for legitimate platform operations.
        </p>
      </>
    ),
  },
  {
    title: "8. Your Privacy Rights",
    content: (
      <>
        <p>
          Depending on applicable law and your circumstances, you may have
          rights to request access to your personal information, correct
          inaccurate information, request deletion, object to certain
          processing, or withdraw consent where processing relies on consent.
        </p>

        <p>
          Requests may be subject to identity checks, legal exceptions, and
          other applicable requirements. We will consider and respond to
          legitimate requests in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    title: "9. Cookies and Similar Technologies",
    content: (
      <>
        <p>
          MushaLink may use cookies or similar technologies that are necessary
          for functions such as authentication, session management, security,
          and remembering user preferences.
        </p>

        <p>
          The use of optional analytics, advertising, or tracking technologies
          should be disclosed separately where applicable. This policy does
          not represent that MushaLink uses any particular advertising or
          analytics service unless that service is actually enabled.
        </p>
      </>
    ),
  },
  {
    title: "10. Children's Privacy",
    content: (
      <>
        <p>
          MushaLink is intended for people who can legally use its accommodation
          services and create an account. We do not knowingly seek to collect
          personal information from children where doing so would be unlawful.
          If you believe a child has provided personal information improperly,
          please contact us.
        </p>
      </>
    ),
  },
  {
    title: "11. Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy as MushaLink develops, our
          practices change, or applicable legal requirements evolve. The
          updated version will be published on this page with a revised
          effective date where appropriate.
        </p>
      </>
    ),
  },
  {
    title: "12. Contact MushaLink",
    content: (
        <>
        <p>
            For privacy questions, requests concerning your personal information,
            or concerns about how information is handled, contact MushaLink
            using our official support number.
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
            Please do not send passwords, identity documents, or other sensitive
            information through ordinary messaging channels unless you have
            been provided with a suitable secure method.
        </p>
        </>
    ),
    },
];

export default function PrivacyPage() {
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

          {/* Policy header */}
          <header className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">
              MushaLink
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Effective date: October 19, 2026
            </p>

            <p className="mt-6 leading-7 text-slate-600">
              Your privacy matters. This policy explains how MushaLink handles
              personal information when you use our student accommodation
              platform, communicate with landlords, or participate in applicable
              verification processes.
            </p>
          </header>

          {/* Policy sections */}
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