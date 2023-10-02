'use client'
import React from 'react'

import * as z from "zod"



import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'



import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Ghost, ImageIcon, Pencil, PlusCircle } from 'lucide-react'

import toast from 'react-hot-toast'



import { Attachment, Course } from '@prisma/client'
import Image from 'next/image'

import { FileUpload } from '@/components/file-upload'


interface AttachmentFormProps {
    
    initialData: Course & {attachments : Attachment[] }
    courseId: string
}

const formSchema = z.object({
    url : z.string().min(1)
})

const AttachmentForm = ({
    initialData, courseId
}: AttachmentFormProps) => {

    const  [isEditing, setisEditing] = useState(false)

    const toggleEdit  = () =>{
        setisEditing((current) => !current)
    }

    const router = useRouter()
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`,values)
            toast.success("Course Update Successfully ")
            toggleEdit()
            router.refresh()
        } catch  {
            toast.error("Something Went Wrong ")
        }
    }
    return (

        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Attachments  
                <Button onClick={toggleEdit}variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle  className='h-4 w-4 mr-2'/>
                            Add an Image 
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
                </>
                )}
            {isEditing && (
                <div>
                    <FileUpload  endpoint='courseAttachment' onChange={(url)=> {
                            if(url){
                                onSubmit({url : url})
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Add any Extra File for Further Context or Understanding...
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

export default AttachmentForm

