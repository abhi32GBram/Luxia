'use client'
import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Flag, Trash } from 'lucide-react'
import ConfirmModal from '@/components/modals/confirm-modal'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useConfettiStore } from '@/hooks/use-confetti-store'


interface ActionsProps {
    disabled: boolean
    courseId: string

    isPublished: boolean
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {

    const confetti  =  useConfettiStore()


    const router = useRouter()
    const [isLoading, setisLoading] = useState(false)

    const onClick = async () => {
        try {
            setisLoading(true)

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Course is Unpublished")
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success("Course is Published")
                confetti.onOpen()
            }
            router.refresh()

        } catch (error) {
            toast.error("Something Went Wrong !")
        } finally {
            setisLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setisLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            toast.success("Course Deleted Successfully.")
            router.refresh()
            router.push(`/teacher/courses`)
        } catch (error) {
            toast.error("Something Went Wrong !")
        } finally {
            setisLoading(false)
        }
    }
    return (
        <div className='flex items-center gap-x-2'>
            <Button onClick={onClick} disabled={disabled || isLoading} variant='outline' size='sm'>
                {isPublished ? "Unpublish " : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Actions
