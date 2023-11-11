// This line indicates that the code should run only on the client-side and not during server-side rendering.
'use client'

// Importing necessary React and third-party libraries
import React from 'react'
import * as z from "zod"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Ghost, ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import MuxPlayer from '@mux/mux-player-react'
import { Course, MuxData, Chapter } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'

// Defining the props for the ChapterVideoForm component
interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string
    chapterId: string
}

// Schema for form validation using Zod library
const formSchema = z.object({
    videoUrl: z.string().min(1)
})

// The ChapterVideoForm component
const ChapterVideoForm = ({
    initialData, courseId, chapterId
}: ChapterVideoProps) => {
    // State to manage edit mode
    const [isEditing, setisEditing] = useState(false)

    // Function to toggle edit mode
    const toggleEdit = () => {
        setisEditing((current) => !current)
    }

    // Hook to use Next.js router for navigation
    const router = useRouter()

    // Function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Sending PATCH request to update chapter video
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            // Display success message
            toast.success("Chapter Update Successfully ")
            // Exit edit mode and refresh the page
            toggleEdit()
            router.refresh()
        } catch {
            // Display error message on failure
            toast.error("Something Went Wrong ")
        }
    }

    // Rendering the component
    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : !initialData.videoUrl ? (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a Video
                        </>
                    ) : (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit the Video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    // Display placeholder if no video URL is present
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    // Display the video player if video URL exists
                    <div className='relative aspect-video mt-2'>
                        <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
                    </div>
                )
            )}
            {isEditing && (
                // File upload component to upload a new video
                <div>
                    <FileUpload endpoint='chapterVideo' onChange={(url) => {
                        if (url) {
                            onSubmit({ videoUrl: url })
                        }
                    }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Upload a Video for this Chapter
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                // Display a note about video processing time
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take a few Minutes to Process...
                    Refresh the Page if Video dosen&apos;t Appear
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm
