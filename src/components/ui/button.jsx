import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,background-color,box-shadow,transform] duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        outline:
          "border border-border bg-background/80 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        // marketing actions
        ink: "bg-ink text-white shadow-[0_10px_24px_rgba(10,11,12,0.18)] hover:-translate-y-px hover:bg-[#232527]",
        brand: "bg-brand text-ink shadow-[0_10px_24px_rgba(190,150,0,0.22)] hover:-translate-y-px hover:bg-[#ffe234]",
        glass:
          "border border-white/90 bg-white/80 text-ink shadow-[0_8px_22px_rgba(30,50,70,0.1)] backdrop-blur-md hover:-translate-y-px hover:bg-white",
        light: "border border-ink/10 bg-white text-ink shadow-sm hover:-translate-y-px hover:bg-mist",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-[15px] [&_svg]:size-[18px]",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
