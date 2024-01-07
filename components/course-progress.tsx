// Import necessary components and utility functions
import { Progress } from "@/components/ui/progress" // Importing Progress component
import { cn } from "@/lib/utils" // Importing utility function for class name concatenation

// Define the properties for the CourseProgress component
interface CourseProgressProps {
    value: number // The current progress value
    variant?: "default" | "success" // The variant of the progress bar
    size?: "default" | "sm" // The size of the progress bar
}

// Define the color classes based on the variant
const colorByVariant = {
    default: " text-purple-700", // Default color class
    success: "text-emerald-700" // Success color class
}

// Define the size classes based on the size
const sizeByVariant = {
    default: " text-sm", // Default size class
    sm: "text-xs" // Small size class
}

// Define the CourseProgress component
export const CourseProgress = ({ value, variant, size }: CourseProgressProps) => {
    return (
        // Render the Progress component with the provided props
            // Render a paragraph displaying the progress percentage
                // Display the rounded progress value followed by '% Complete'
        <div>
            <Progress className="h-2" value={value} variant={variant} />
            <p className={cn(
                " font-medium mt-2 text-purple-700", // Base class names
                colorByVariant[variant || "default"], // Color class based on variant
                sizeByVariant[size || "default"] // Size class based on size
            )}>
                {Math.round(value)} % Complete
            </p>
        </div>
    )
}
