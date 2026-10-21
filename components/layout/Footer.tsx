import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-brand-blue"
            >
              Musha<span className="text-green-600">Link</span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
              Helping students find accommodation and connect with landlords
              across Zimbabwe.
            </p>
          </div>
      </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Explore
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/browse" className="hover:text-brand-blue">
                  Browse Accommodation
                </Link>
              </li>

              <li>
                <Link href="/universities" className="hover:text-brand-blue">
                  Universities
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-brand-blue">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
            <div>
            <h2 className="text-sm font-semibold text-slate-900">
                Support & Legal
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {/* Call Support */}
                <li>
                <a
                    href="tel:+14697458913"
                    className="hover:text-brand-blue"
                >
                    Call Support: +1 (469) 745-8913
                </a>
                </li>

                {/* WhatsApp Support */}
                <li>
                <a
                    href="https://wa.me/14697458913"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-blue"
                >
                    WhatsApp Support
                </a>
                </li>

                {/* Privacy Policy */}
                <li>
                <Link href="/privacy" className="hover:text-brand-blue">
                    Privacy Policy
                </Link>
                </li>

                {/* Terms of Service */}
                <li>
                <Link href="/terms" className="hover:text-brand-blue">
                    Terms of Service
                </Link>
                </li>
            </ul>
            </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} MushaLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}