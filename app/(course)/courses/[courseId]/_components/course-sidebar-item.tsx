// Use the client-side rendering mode
"use client"

// Importing necessary utilities and icons
import { cn } from "@/lib/utils" // Utility function for class names
import { CheckCircle, Lock, PlayCircle } from "lucide-react" // Icons from lucide-react
import { usePathname, useRouter } from "next/navigation" // Hooks for navigation

// Interface for the props of the CourseSidebarItem component
interface CourseSidebarItemProps {
    label: string // Label of the item
    id: string // ID of the item
    isCompleted: boolean // Whether the item is completed
    courseId: string // ID of the course
    isLocked: boolean // Whether the item is locked
}

// CourseSidebarItem component
export const CourseSidebarItem = ({ label, id, isCompleted, courseId, isLocked }: CourseSidebarItemProps) => {

    // Get the current pathname and router instance
    const pathname = usePathname()
    const router = useRouter()

    // Determine the icon based on whether the item is locked or completed
    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle)

    // Check if the current pathname includes the item's ID
    const isActive = pathname?.includes(id)

    // Function to handle click events
    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`) // Navigate to the chapter page
    }

    // Render the button
    return (
        <button onClick={onClick} type="button" className={cn(
            "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-800 hover:bg-slate-400/20", // Base styles
            isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700", // Styles when active
            isCompleted && " text-emerald-700 hover:text-emerald-700", // Styles when completed
            isActive && isCompleted && " bg-emerald-200/20" // Styles when both active and completed
        )}>
            <div className=" flex items-center gap-x-2 py-4">
                <Icon size={22} className={cn(
                    "text-slate-500", // Base icon style
                    isActive && " text-slate-700", // Icon style when active
                    isCompleted && "text-emerald-700" // Icon style when completed
                )} />
                {label} 
            </div>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all", // Base div style
                isActive && " opacity-100", // Div style when active
                isCompleted && " border-emerald-700" // Div style when completed
            )} />
        </button>
    )
}
