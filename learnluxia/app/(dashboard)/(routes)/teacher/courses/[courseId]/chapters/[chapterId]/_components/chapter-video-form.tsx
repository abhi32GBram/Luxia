'use client'
import React from 'react'

import * as z from "zod"



import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'



import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Ghost, ImageIcon, Pencil, PlusCircle, Video } from 'lucide-react'

import toast from 'react-hot-toast'



import { Course, MuxData, Chapter} from '@prisma/client'
import Image from 'next/image'

import { FileUpload } from '@/components/file-upload'


interface ChapterVideoProps {

    initialData: Chapter & {muxData?: MuxData | null }
    courseId: string
    chapterId : string 
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

const ChapterVideoForm = ({
    initialData, courseId,chapterId
}: ChapterVideoProps) => {

    const [isEditing, setisEditing] = useState(false)

    const toggleEdit = () => {
        setisEditing((current) => !current)
    }

    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter Update Successfully ")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something Went Wrong ")
        }
    }
    return (

        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit the Video
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        Video Uploaded Successfully ! 
                    </div>
                )
            )}
            {isEditing && (
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
                // <Form {...form}>
                //     <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                //         <FormField control={form.control} name='description' render={({field}) => (
                //             <FormItem>
                //                 <FormControl>
                //                     <Textarea disabled={isSubmitting} placeholder="'Eg, : 'This Course will be About....'" {...field}/>

                //                 </FormControl>
                //                 <FormMessage />
                //             </FormItem>
                //         )} />
                //         <div className='flex items-center gap-x-2'>
                //             <Button disabled={!isValid || isSubmitting} type='submit'>
                //                 Save 
                //             </Button>
                //         </div>
                //     </form>
                // </Form>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take a few Minutes to Process...
                    Refresh the Page if Video dosen&apos;t Appear 
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm

// 5 37 10