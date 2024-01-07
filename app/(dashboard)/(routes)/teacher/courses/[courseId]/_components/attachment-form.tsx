'use client'
import React from 'react'

import * as z from "zod"

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'


import { Button } from '@/components/ui/button'

import { File, Ghost, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react'

import toast from 'react-hot-toast'

import { Attachment, Course } from '@prisma/client'


import { FileUpload } from '@/components/file-upload'


interface AttachmentFormProps {

    initialData: Course & { attachments: Attachment[] }
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
})

const AttachmentForm = ({
    initialData, courseId
}: AttachmentFormProps) => {

    const [isEditing, setisEditing] = useState(false)
    const [deletingId, setdeletingId] = useState<string | null>(null)

    const toggleEdit = () => {
        setisEditing((current) => !current)
    }

    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course Update Successfully ")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something Went Wrong ")
        }
    }
    const onDelete = async (id: string) => {
        try {
            setdeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("Attachment Deleted Successfully ")
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong !! ")
        } finally {
            setdeletingId(null)
        }
    }
    return (

        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add Your Files
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>
                            No Attachments Given Yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment) => (
                                <div key={attachment.id} className='flex items-center p-3 w-full bg-purple-100 border-purple-300 border text-purple-700 rounded-md'>
                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                    <p className='text-xs line-clamp-1'>{attachment.name}</p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className='h-4 w-4  animate-spin' />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button className='ml-auto hover:opacity-75 transition' onClick={() => onDelete(attachment.id)}>
                                            <X className='h-4 w-4 ' />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint='courseAttachment' onChange={(url) => {
                        if (url) {
                            onSubmit({ url: url })
                        }
                    }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Add Extra Files for your Students
                    </div>

                </div>
            )}
        </div>
    )
}

export default AttachmentForm

