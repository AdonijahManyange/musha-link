import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

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

      {/* Floating WhatsApp support button */}
      <WhatsAppButton />
    </div>
  );
}