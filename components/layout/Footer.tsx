import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        mt-auto border-t border-slate-200 bg-white
        transition-colors duration-200
        dark:border-slate-800 dark:bg-slate-950
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Footer Columns */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="
                text-xl font-bold tracking-tight text-brand-blue
                dark:text-blue-400
              "
            >
              Musha<span className="text-green-600 dark:text-green-400">Link</span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">
              Helping students find accommodation and connect with landlords
              across Zimbabwe.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Explore
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link
                  href="/browse"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  Browse Accommodation
                </Link>
              </li>

              <li>
                <Link
                  href="/universities"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  Universities
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Support & Legal
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <a
                  href="tel:+14697458913"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  Call Support: +1 (469) 745-8913
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/14697458913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  WhatsApp Support
                </a>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-brand-blue dark:hover:text-blue-400"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} MushaLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}