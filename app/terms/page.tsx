import type { Metadata } from "next";
import Link from "next/link";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

export const metadata: Metadata = {
  title: "Terms of Service | MushaLink",
  description:
    "Read the Terms of Service governing the use of MushaLink, Zimbabwe's student accommodation marketplace for students and property landlords.",
  alternates: {
    canonical: "https://mushalink.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    title: "1. About MushaLink",
    content: (
      <>
        <p>
          MushaLink is an online student accommodation marketplace designed to
          help students in Zimbabwe discover accommodation and connect with
          property landlords.
        </p>

        <p>
          The platform may provide property listings, photographs, rental
          information, landlord verification features, messaging, viewing
          requests, notifications, and other accommodation-related services.
        </p>

        <p>
          Unless expressly stated otherwise, MushaLink acts as a platform for
          facilitating connections between students and landlords. A listing
          appearing on MushaLink does not, by itself, mean that MushaLink owns,
          manages, inspects, or guarantees the property.
        </p>
      </>
    ),
  },
  {
    title: "2. Acceptance of These Terms",
    content: (
      <>
        <p>
          By accessing or using MushaLink, you agree to these Terms of Service
          and our Privacy Policy.
        </p>

        <p>
          If you do not agree to these terms, you should not use the platform.
          If you create an account on behalf of another person or organization,
          you confirm that you have the authority to do so.
        </p>

        <p>
          We may update these terms as the platform develops. Material changes
          will be published on this page, together with an updated effective
          date where appropriate.
        </p>
      </>
    ),
  },
  {
    title: "3. Eligibility and Accounts",
    content: (
      <>
        <p>
          You must be legally eligible to use MushaLink and enter into any
          agreements associated with your use of the platform. If you are
          under the age required to enter into a binding agreement, you may
          use relevant services only where permitted by applicable law and
          with any required involvement of a parent, guardian, or other
          authorized person.
        </p>

        <p>
          When creating an account, you agree to provide accurate information
          and keep your account details reasonably up to date.
        </p>

        <p>You are responsible for:</p>

        <ul>
          <li>Maintaining the confidentiality of your login credentials.</li>
          <li>Using your account only for lawful purposes.</li>
          <li>Notifying us if you suspect unauthorized account access.</li>
          <li>
            Ensuring that information submitted through your account is
            accurate and not misleading.
          </li>
        </ul>

        <p>
          You must not impersonate another person, create accounts using
          deceptive information, or attempt to access another user's account
          without authorization.
        </p>
      </>
    ),
  },
  {
    title: "4. Student Responsibilities",
    content: (
      <>
        <p>
          Students may use MushaLink to explore accommodation, save listings,
          communicate with landlords, and submit property viewing requests
          where those features are available.
        </p>

        <p>When using the platform, students agree to:</p>

        <ul>
          <li>Provide truthful account and contact information.</li>
          <li>
            Use messaging and viewing-request features respectfully and
            for genuine accommodation-related purposes.
          </li>
          <li>
            Review property information and ask relevant questions before
            making accommodation decisions.
          </li>
          <li>
            Exercise reasonable caution when communicating with landlords
            or arranging property visits.
          </li>
          <li>
            Avoid sending money or sharing sensitive information before
            taking appropriate steps to assess the legitimacy of a property
            and the person offering it.
          </li>
          <li>
            Respect landlords, other users, and applicable laws.
          </li>
        </ul>

        <p>
          Submitting a viewing request does not automatically confirm an
          appointment. The landlord must respond or otherwise confirm the
          arrangements.
        </p>
      </>
    ),
  },
  {
    title: "5. Landlord Responsibilities",
    content: (
      <>
        <p>
          Landlords who use MushaLink to advertise accommodation are
          responsible for the properties they list and the information they
          provide.
        </p>

        <p>Landlords agree to:</p>

        <ul>
          <li>
            Provide accurate property descriptions, photographs, locations,
            rental prices, and other material listing information.
          </li>
          <li>
            Have the legal authority or appropriate permission to advertise
            the property.
          </li>
          <li>
            Ensure that rental terms, deposits, fees, and other charges are
            communicated honestly.
          </li>
          <li>
            Respond to students professionally and communicate changes to
            availability or viewing arrangements.
          </li>
          <li>
            Submit genuine information and documents when verification
            is required.
          </li>
          <li>
            Comply with applicable housing, consumer protection, privacy,
            and other relevant legal requirements.
          </li>
        </ul>

        <p>
          Landlords must not publish fraudulent listings, advertise properties
          they are not authorized to offer, misrepresent property ownership,
          or use MushaLink to facilitate unlawful discrimination, harassment,
          or fraudulent activity.
        </p>
      </>
    ),
  },
  {
    title: "6. Property Listings and Availability",
    content: (
      <>
        <p>
          Property information on MushaLink may be submitted by landlords
          or other authorized listing providers. Although we may implement
          moderation and verification measures, we cannot guarantee that
          every listing is complete, current, accurate, or independently
          inspected.
        </p>

        <p>
          Rental prices, availability, amenities, photographs, locations,
          and other details may change. Students should confirm important
          information directly with the relevant landlord before making
          commitments.
        </p>

        <p>
          MushaLink may review, reject, restrict, unpublish, or remove
          listings that appear misleading, fraudulent, unsafe, unlawful,
          or inconsistent with these terms.
        </p>

        <p>
          Listing publication does not constitute an endorsement of the
          property or a guarantee that a rental arrangement will be successful.
        </p>
      </>
    ),
  },
  {
    title: "7. Landlord Verification and Trust Indicators",
    content: (
      <>
        <p>
          MushaLink may offer landlord identity checks, document reviews,
          or other verification features to help users assess accommodation
          listings and the people offering them.
        </p>

        <p>
          Verification results indicate only the checks performed and the
          results recorded by the platform or its verification providers.
          They do not automatically establish legal ownership of a property,
          guarantee that a listing is safe, or eliminate the possibility
          of fraud.
        </p>

        <p>
          Verification badges, where available, must not be interpreted as
          an unconditional guarantee by MushaLink. Users should still make
          their own reasonable checks before entering into a rental agreement
          or transferring money.
        </p>

        <p>
          Landlords must not falsify documents, misuse verification badges,
          or attempt to bypass verification requirements.
        </p>
      </>
    ),
  },
  {
    title: "8. Viewing Requests and Communications",
    content: (
      <>
        <p>
          MushaLink may allow students and landlords to exchange messages
          and manage property viewing requests through the platform.
        </p>

        <p>
          Users are responsible for the accuracy and appropriateness of
          their communications. You must not use these features to send
          threats, spam, fraudulent offers, abusive messages, or unlawful
          content.
        </p>

        <p>
          A viewing request is not a tenancy agreement, reservation guarantee,
          or promise that a property will remain available.
        </p>

        <p>
          Users should confirm the viewing date, time, location, and any
          relevant arrangements directly with the other party before
          travelling to a property.
        </p>
      </>
    ),
  },
  {
    title: "9. Payments, Rent, and Rental Agreements",
    content: (
      <>
        <p>
          Unless a payment feature is expressly introduced and described
          by MushaLink, users should understand that property rental payments,
          deposits, and other financial arrangements are handled separately
          between the relevant parties.
        </p>

        <p>
          Students and landlords are responsible for agreeing on rental
          terms, payment arrangements, deposits, utility charges, and any
          other obligations associated with a property.
        </p>

        <p>
          Before making a payment, users should independently verify the
          identity of the recipient, the property's availability, the
          authority to rent the property, and the agreed terms.
        </p>

        <p>
          Any tenancy or rental agreement is between the parties entering
          into it. MushaLink is not a party to that agreement unless an
          express written agreement states otherwise.
        </p>
      </>
    ),
  },
  {
    title: "10. Prohibited Activities",
    content: (
      <>
        <p>You must not use MushaLink to:</p>

        <ul>
          <li>Commit fraud or misrepresent your identity or authority.</li>
          <li>Publish fake, misleading, or unauthorized property listings.</li>
          <li>Upload forged identity documents or verification records.</li>
          <li>
            Harass, threaten, discriminate against, or exploit other users.
          </li>
          <li>
            Attempt to access restricted accounts, systems, or information
            without permission.
          </li>
          <li>
            Introduce malicious software, interfere with platform security,
            or disrupt website operations.
          </li>
          <li>
            Scrape, copy, or reuse platform content in ways that violate
            applicable law or the rights of others.
          </li>
          <li>
            Use the platform for unlawful activities or purposes unrelated
            to its intended services.
          </li>
        </ul>

        <p>
          We may investigate suspected violations and take proportionate
          action where appropriate.
        </p>
      </>
    ),
  },
  {
    title: "11. Intellectual Property",
    content: (
      <>
        <p>
          MushaLink's branding, logo, website design, original platform
          content, and software may be protected by applicable intellectual
          property laws.
        </p>

        <p>
          You may not reproduce, modify, distribute, or commercially exploit
          protected MushaLink materials without appropriate permission,
          except where permitted by law.
        </p>

        <p>
          Users retain whatever rights they have in the content they submit.
          By submitting content for use on the platform, you grant MushaLink
          permission to host, display, reproduce, and process that content
          as reasonably necessary to operate, promote, secure, and improve
          the relevant services, subject to applicable law and our Privacy
          Policy.
        </p>

        <p>
          You must have the necessary rights or permissions to submit
          photographs, descriptions, documents, and other material.
        </p>
      </>
    ),
  },
  {
    title: "12. Privacy and Personal Information",
    content: (
      <>
        <p>
          Your use of MushaLink is also governed by our Privacy Policy,
          which explains how personal information may be collected, used,
          stored, and shared.
        </p>

        <p>
          You agree to provide personal information through the platform
          only where you have the right to do so and to use information
          obtained through MushaLink responsibly.
        </p>

        <p>
          Users must not misuse another person's contact details, identity
          documents, photographs, or other personal information.
        </p>
      </>
    ),
  },
  {
    title: "13. Third-Party Services and Links",
    content: (
      <>
        <p>
          MushaLink may rely on third-party services for hosting, storage,
          identity verification, authentication, notifications, or other
          platform functions. The availability and operation of these
          services may be subject to the providers' own terms and policies.
        </p>

        <p>
          The website may also contain links to external websites or services.
          MushaLink does not control all third-party websites and is not
          responsible for their content, policies, availability, or practices.
        </p>

        <p>
          Users should review the relevant third-party terms and privacy
          policies before using external services.
        </p>
      </>
    ),
  },
  {
    title: "14. Platform Availability and Changes",
    content: (
      <>
        <p>
          We aim to keep MushaLink available and functioning properly,
          but uninterrupted access cannot be guaranteed.
        </p>

        <p>
          Maintenance, technical problems, security incidents, third-party
          service failures, or other circumstances may affect availability.
        </p>

        <p>
          We may add, change, suspend, or discontinue features as the platform
          develops, subject to applicable law and any obligations we have
          expressly agreed to meet.
        </p>
      </>
    ),
  },
  {
    title: "15. Disclaimers and Limitation of Liability",
    content: (
      <>
        <p>
          To the extent permitted by applicable law, MushaLink provides
          its marketplace and related services on an available basis and
          does not guarantee that every listing, user, property, or
          communication is accurate, safe, lawful, or suitable.
        </p>

        <p>
          MushaLink does not guarantee that a student will find accommodation,
          that a landlord will find a tenant, or that a viewing or rental
          arrangement will proceed as expected.
        </p>

        <p>
          Users are responsible for assessing properties, verifying relevant
          information, exercising reasonable caution, and deciding whether
          to enter into agreements with other users.
        </p>

        <p>
          To the extent permitted by law, MushaLink will not be responsible
          for indirect or consequential losses arising from the use of the
          platform, inaccurate user-submitted information, third-party
          conduct, or rental arrangements between users.
        </p>

        <p>
          Nothing in these terms excludes or limits liability where doing
          so would be unlawful, including any rights or protections that
          cannot legally be excluded under applicable law.
        </p>
      </>
    ),
  },
  {
    title: "16. Suspension and Account Termination",
    content: (
      <>
        <p>
          We may restrict, suspend, or terminate access to an account or
          listing where we reasonably believe that a user has violated
          these terms, engaged in fraudulent activity, threatened platform
          security, or created a significant risk to other users.
        </p>

        <p>
          Where appropriate and permitted by law, we may provide an
          explanation or an opportunity to address the issue.
        </p>

        <p>
          Users may stop using MushaLink and may request account-related
          action through the contact channels made available on the platform,
          subject to applicable legal and operational requirements.
        </p>
      </>
    ),
  },
  {
    title: "17. Changes to These Terms",
    content: (
      <>
        <p>
          We may revise these Terms of Service to reflect changes to
          MushaLink, our features, our practices, or applicable legal
          requirements.
        </p>

        <p>
          Updated terms will be published on this page. The effective date
          will be revised when appropriate.
        </p>

        <p>
          Your continued use of MushaLink after updated terms take effect
          will be subject to applicable law and any consent or notification
          requirements that apply to the changes.
        </p>
      </>
    ),
  },
  {
    title: "18. Applicable Law and Disputes",
    content: (
      <>
        <p>
          These terms are intended to operate consistently with the laws
          applicable to MushaLink and its users, including relevant laws
          of Zimbabwe where applicable.
        </p>

        <p>
          Users should first attempt to resolve disputes relating to
          platform interactions through reasonable communication.
          Nothing in this section prevents a person from pursuing rights
          or remedies available under applicable law.
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

export default function TermsPage() {
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
              Terms of Service
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Effective date: October 19, 2026
            </p>

            <p className="mt-6 leading-7 text-slate-600">
              These Terms of Service explain the rules and responsibilities
              that apply when students, landlords, and other visitors use
              MushaLink to explore accommodation and connect with one another
              across Zimbabwe.
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