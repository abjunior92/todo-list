import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "w-full py-3 px-4 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-green-400 hover:bg-green-500 text-white focus:ring-green-400",
        secondary:
          "bg-gray-200 hover:bg-gray-300 text-black focus:ring-gray-400",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  variant,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </button>
  );
}
