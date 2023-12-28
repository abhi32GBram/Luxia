'use client'
import React from 'react'

import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from "react-hook-form"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Ghost, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'


interface ChapterTitleFormProps {

    initialData: {
        title: string,
    },
    courseId: string
    chapterId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})

const ChapterTitleForm = ({
    initialData, courseId, chapterId
}: ChapterTitleFormProps) => {

    const [isEditing, setisEditing] = useState(false)

    const toggleEdit = () => {
        setisEditing((current) => !current)
    }

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const { isSubmitting, isValid } = form.formState
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
                Chapter Title
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Title
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='title' render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="'Eg, : 'Welcome to the Course '" {...field} />

                                </FormControl>
                                <FormMessage />
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

export default ChapterTitleForm

// http://localhost:3000/teacher/courses/4f9b3d1a-72e8-47a6-9dc5-a71b8295294b