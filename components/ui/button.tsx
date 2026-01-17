import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumen-creative focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-lumen-energy text-white rounded-full shadow-md shadow-lumen-energy/30 hover:bg-lumen-energy/90 hover:shadow-lg hover:shadow-lumen-energy/40 hover:scale-105",
                outline:
                    "border-2 border-lumen-structure text-lumen-structure rounded-full bg-transparent hover:bg-lumen-structure/5 hover:scale-105",
                secondary:
                    "bg-lumen-creative text-white rounded-full shadow-md hover:bg-lumen-creative/90 hover:shadow-lg hover:scale-105",
                ghost:
                    "text-lumen-creative hover:bg-lumen-creative/10 rounded-lg",
                link:
                    "text-lumen-creative underline-offset-4 hover:underline font-semibold",
            },
            size: {
                default: "h-12 px-6 text-base",
                sm: "h-10 px-4 text-sm",
                lg: "h-14 px-8 text-lg",
                xl: "h-16 px-10 text-xl",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
