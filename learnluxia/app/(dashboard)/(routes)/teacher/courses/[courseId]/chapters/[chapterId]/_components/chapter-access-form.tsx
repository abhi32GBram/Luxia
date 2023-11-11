// Import required modules and dependencies
'use client'
import React from 'react'

import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from "react-hook-form"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import axios from 'axios'

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Ghost, Pencil } from 'lucide-react'

import toast from 'react-hot-toast'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Chapter, Course } from '@prisma/client'
import { Editor } from '@/components/editor'
import { Preview } from '@/components/preview'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

// Define props for ChapterAccessForm
interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string
    chapterId: string
}

// Define a form schema using Zod for managing form data
const formSchema = z.object({
    isFree: z.boolean().default(false)
})

// Define the ChapterAccessForm component
const ChapterAccessForm = ({
    initialData, courseId, chapterId
}: ChapterAccessFormProps) => {

    // State to manage editing mode
    const [isEditing, setisEditing] = useState(false)

    // Function to toggle editing mode
    const toggleEdit = () => {
        setisEditing((current) => !current)
    }

    // Router for navigation
    const router = useRouter()

    // Form setup using react-hook-form and Zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: Boolean(initialData.isFree)
        }
    })

    // Form state
    const { isSubmitting, isValid } = form.formState

    // Function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Send a PATCH request to update the chapter access
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
                Chapter Preview Access
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.isFree && "text-slate-500 italic "
                )}>
                    {initialData.isFree ? (
                        <>
                            This Chapter is Free for Preview
                        </>
                    ) : (
                        <>
                            This Chapter isn't Free
                        </>
                    )}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='isFree' render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormDescription>
                                        Check the Box if you want this Chapter to be Free for Preview
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} />
                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

// Export the ChapterAccessForm component as the default export
export default ChapterAccessForm
