import Link from "next/link";
import { Heart } from "lucide-react";

type Props = {
  mobile?: boolean;
  onClick?: () => void;
};

export default function NavLinks({
  mobile = false,
  onClick,
}: Props) {
  const className = mobile
    ? "block rounded-xl px-4 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-100"
    : "transition hover:text-brand-blue";

  return (
    <>
      <Link href="/" className={className} onClick={onClick}>
        Home
      </Link>

      <Link href="/browse" className={className} onClick={onClick}>
        Browse
      </Link>

      <Link
        href="/saved"
        className={`${className} flex items-center gap-2`}
        onClick={onClick}
      >
        <Heart
          size={16}
          className="fill-red-500 text-red-500"
        />
        Saved
      </Link>

      <Link
        href="/universities"
        className={className}
        onClick={onClick}
      >
        Universities
      </Link>

      <Link
        href="/about"
        className={className}
        onClick={onClick}
      >
        About
      </Link>
    </>
  );
}