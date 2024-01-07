// Importing necessary React and icon components
import React from 'react'
import { AlertTriangle, CheckCircleIcon } from 'lucide-react'

// Importing the class-variance-authority for conditional styling and utility function for className merging
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Defining the base and variant styles for the banner component using cva
const bannerVariants = cva(
    "border text-center p-4 text-sm flex items-center w-full", // Base styles: border, center-aligned text, padding, text size, flex container, width
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-30 text-primary", // Warning variant: yellow background, yellow border, primary text color
                success: "bg-emerald-700 border-emerald-800 text-secondary" // Success variant: emerald background, emerald border, secondary text color
            },
            defaultVariants: {
                variant: "warning" // Default variant set to warning
            }
        }
    }
)

// Defining the interface for the Banner component's props
interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string // Label prop to display the text inside the banner
}

// Mapping each variant to its corresponding icon
const iconMap = {
    warning: AlertTriangle, // Warning icon
    success: CheckCircleIcon // Success icon
}

// The Banner functional component
const Banner = ({ label, variant }: BannerProps) => {

    // Determining which icon to use based on the variant or default to warning icon
    const Icon = iconMap[variant || 'warning']

    // Returning the banner component structure
    return (
        <div className={cn(bannerVariants({ variant }))}> 
            <Icon className='h-4 w-4 mr-2' /> 
            {label} 
        </div>
    )
}

// Exporting the Banner component
export default Banner
