// Directive to inform Next.js that this module is for client-side only.
'use client'
// Standard React import.
import React from 'react'
import { useState } from 'react'

// Import a Button component from a designated UI component library.
import { Button } from '@/components/ui/button'
// Import the Trash icon from 'lucide-react', a library of icons.
import { Flag, Trash } from 'lucide-react'
import ConfirmModal from '@/components/modals/confirm-modal'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Define an interface for the props that the ChapterActions component will receive.
interface ChapterActionsProps {
    disabled: boolean   // Indicates whether actions should be disabled.
    courseId: string    // The ID of the course the chapter belongs to.
    chapterId: string   // The ID of the chapter these actions relate to.
    isPublished: boolean // Flag to indicate if the chapter is published or not.
}


// ChapterActions is a functional React component taking props for handling chapter actions
const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {
    // Initializing the useRouter hook from Next.js for programmatically controlling route navigation
    const router = useRouter()

    // useState hook to manage loading state of the component
    const [isLoading, setisLoading] = useState(false)

    // Function to handle the click event for publishing or unpublishing a chapter
    const onClick = async () => {
        try {
            setisLoading(true) // Setting loading state to true at the beginning of the operation

            // Checking if the chapter is already published
            if (isPublished) {
                // If the chapter is published, send a PATCH request to unpublish it
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Chapter is Unpublished")
            } else {
                // If the chapter is not published, send a PATCH request to publish it
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Chapter is Published")
            }
            router.refresh()

        } catch (error) {
            toast.error("Something Went Wrong !") // Toast in-case an operation fails
        } finally {
            setisLoading(false) // Resetting loading state to false after the operation
        }
    }

    // Function to handle the deletion of a chapter
    const onDelete = async () => {
        try {
            setisLoading(true) // Setting loading state to true at the beginning of the operation
            // Sending a DELETE request to the server to delete the chapter
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            // Refresh the current page and navigate to the course's page after deletion
            router.refresh()
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            toast.error("Something Went Wrong !") // Displaying an error toast notification in case of failure
        } finally {
            setisLoading(false) // Resetting loading state to false after the operation
        }
    }
    return (
        // Container for the action buttons, using flexbox for layout.
        <div className='flex items-center gap-x-2'>
            {/* Publish/Unpublish button. The label changes based on the isPublished state. */}
            <Button onClick={onClick} disabled={disabled || isLoading} variant='outline' size='sm'>
                {isPublished ? "Unpublish " : "Publish"}
            </Button>
            {/* Button with a Trash icon, for deleting the chapter. */}
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>
        </div>
    )
}

// Export the component for use in other parts of the application.
export default ChapterActions
