import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";

type PublicSiteLayoutProps = {
  children: ReactNode;
};

export default function PublicSiteLayout({
  children,
}: PublicSiteLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {children}
      <Footer />
    </div>
  );
}