import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-xl font-semibold transition duration-300";

  const variants = {
    primary:
      "bg-brand-blue text-white hover:bg-brand-blue-dark",

    secondary:
      "border border-slate-300 bg-white text-brand-blue hover:bg-slate-100",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}