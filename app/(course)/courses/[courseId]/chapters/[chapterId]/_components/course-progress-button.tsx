"use client"

import { Button } from "@/components/ui/button" // Importing Button component
import { useConfettiStore } from "@/hooks/use-confetti-store" // Importing custom hook for confetti store
import axios from "axios" // Importing axios for making HTTP requests
import { CheckCircle, XCircle } from "lucide-react" // Importing icons from lucide-react library
import { useRouter } from "next/navigation" // Importing useRouter hook from Next.js for routing
import { useState } from "react" // Importing useState hook from React for managing local state
import toast from "react-hot-toast" // Importing toast for showing notifications

// Define the props interface for the CourseProgessButton component
interface CourseProgessButtonProps {
    chapterId: string // ID of the current chapter
    courseId: string // ID of the current course
    nextChapterId?: string // Optional ID of the next chapter
    isCompleted?: boolean // Flag indicating whether the current chapter is completed
}

// Define the CourseProgessButton component
export const CourseProgessButton = ({ chapterId, courseId, nextChapterId, isCompleted }: CourseProgessButtonProps) => {
    // Initialize router and confetti store
    const router = useRouter()
    const confetti = useConfettiStore()

    // Initialize loading state
    const [isLoading, setIsLoading] = useState(false)

    // Define click handler
    const onClick = async () => {
        try {
            // Set loading state to true
            setIsLoading(true)

            // Make a PUT request to update the progress of the current chapter
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: !isCompleted })

            // If the current chapter is not completed and there is no next chapter, open the confetti store
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen()
            }
            // If the current chapter is not completed and there is a next chapter, navigate to the next chapter
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }

            // Show a success notification
            toast.success("Progress Updated")
            // Refresh the page
            router.refresh()
        } catch (error) {
            // Show an error notification in case of any errors
            toast.error("Something Went Wrong !")
        } finally {
            // Set loading state back to false after the operation is complete
            setIsLoading(false)
        }
    }

    // Determine which icon to display based on whether the current chapter is completed
    const Icon = isCompleted ? XCircle : CheckCircle

    // Render the button
    return (
        <Button onClick={onClick} type="button" variant={isCompleted ? "outline" : "success"} disabled={isLoading}>
            {isCompleted ? "Not Completed " : "Mark as Complete"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    )
}
