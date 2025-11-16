"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 border-transparent",
        secondary: "bg-blue-100 text-blue-800 border-transparent",
        destructive: "bg-red-100 text-red-800 border-transparent",
        success: "bg-green-100 text-green-800 border-transparent",
        warning: "bg-yellow-100 text-yellow-800 border-transparent",
        info: "bg-sky-100 text-sky-800 border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Badge({
  className,
  variant,
  leftIcon,
  rightIcon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </div>
  )
}
