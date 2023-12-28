'use client'
import React from 'react'

import * as z from "zod"



import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'



import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Ghost, ImageIcon, Pencil, PlusCircle } from 'lucide-react'

import toast from 'react-hot-toast'



import { Course } from '@prisma/client'
import Image from 'next/image'

import { FileUpload } from '@/components/file-upload'


interface ImageFormProps {

    initialData: Course
    courseId: string
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Description is Required !! "
    })
})

const ImageForm = ({
    initialData, courseId
}: ImageFormProps) => {

    const [isEditing, setisEditing] = useState(false)

    const toggleEdit = () => {
        setisEditing((current) => !current)
    }

    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Update Successfully ")
            toggleEdit()
            router.refresh()
        } catch {
            toast.error("Something Went Wrong ")
        }
    }
    return (

        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add an Image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Image
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <Image alt='upload' fill className='object-cover rounded-md' src={initialData.imageUrl} />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload endpoint='courseImage' onChange={(url) => {
                        if (url) {
                            onSubmit({ imageUrl: url })
                        }
                    }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        16:9 Aspect Ratio Recommened
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
        </div>
    )
}

export default ImageForm

