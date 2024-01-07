"use client"
// Import necessary libraries and components
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Define the progress variants using class variance authority
const progressVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all ",
  {
    variants: {
      variant: {
        default: "bg-purple-600",
        success: "bg-emerald-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

// Define the props for the Progress component
export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof progressVariants> { }

// Define the combined props for the Progress component
type CombinedProgressProps = ProgressProps & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>

// Define the Progress component
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps

>(({ className, value, variant, ...props }, ref) => (
  // Use the ProgressPrimitive.Root component from radix-ui
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >

    <ProgressPrimitive.Indicator
      className={cn(progressVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))

// Set the display name of the Progress component
Progress.displayName = ProgressPrimitive.Root.displayName

// Export the Progress component
export { Progress }
