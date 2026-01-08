import { AnchorHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const linkVariants = cva(
  "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded",
  {
    variants: {
      variant: {
        primary:
          "text-green-400 hover:text-green-500 focus:ring-green-400 underline",
        secondary: "text-black hover:underline",
        button:
          "inline-block py-3 px-4 bg-green-400 hover:bg-green-500 text-white focus:ring-green-400 no-underline rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "button";
  href: string;
}

export function Link({
  children,
  variant,
  className,
  href,
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      className={cn(linkVariants({ variant }), className)}
      {...props}
    >
      {children}
    </a>
  );
}
