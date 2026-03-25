import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const Button = ({ className, children, variant, ...rest }: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl shadow-glow-sm hover:shadow-glow",
    secondary:
      "px-5 py-2.5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 rounded-xl",
    ghost:
      "px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg",
    danger: "px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white rounded-xl",
  };

  if (variant) {
    return (
      <button
        className={`${base} ${variants[variant]} ${className || ""}`}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};

export default Button;
