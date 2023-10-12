'use client'
import React from 'react'

import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from "react-hook-form"
import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Divide, Ghost, Loader2, Pencil, PlusCircle } from 'lucide-react'

import toast from 'react-hot-toast'

import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

import { Course,Chapter } from '@prisma/client'

import ChaptersList from './chapters-list'


interface ChaptersFormProps {
    
    initialData: Course & {chapters : Chapter[] }
    courseId: string
}

const formSchema = z.object({
    title : z.string().min(1),
})

const ChaptersForm = ({
    initialData, courseId
}: ChaptersFormProps) => {

    const  [isCreating, setisCreating] = useState(false)
    const  [isUpdating, setisUpdating] = useState(false)

    const toggleCreating  = () => {
        setisCreating((current) => !current)
    }

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title : ""
        }
    })

    
    const { isSubmitting, isValid } = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`,values)
            toast.success("Chapter Created Successfully ")
            toggleCreating()
            router.refresh()
        } catch  {
            toast.error("Something Went Wrong ")
        }
    }

    const onReorder = async (updateData : 
        {
            id:string 
            position : number }[]) => {
                try {
                    setisUpdating(true)

                    await axios.put(`/api/courses/${courseId}/chapters/reorder`,{
                        list : updateData
                    })
                    toast.success("Chapters Reordered Successfully ")
                    router.refresh()
                } catch (error) {
                    toast.error("Something Went Wrong !!")
                }finally{
                    setisUpdating(false)
                }
            }
    return (

        <div className=' relative mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute  h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center '>
                    <Loader2 className='animate-spin h-6 w-6 text-sky-700'/>
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                Course Chapters  
                <Button onClick={toggleCreating}variant="ghost">
                    {isCreating && (
                        <>Cancel</>
                    )}
                    {!isCreating && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a New Chapter
                        </>
                    )}
                    
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='title' render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="'Eg, : 'Introduction to the Course...'" {...field}/>
                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                            <Button disabled={!isValid || isSubmitting} type='submit'>
                                Create Chapter 
                            </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length &&  "No Chapters Added Yet"}

                    <ChaptersList  onEdit={() => {}} onReorder={onReorder}  items={initialData.chapters || []}/>
                </div>
            )}
            {!isCreating && (
                <p className='text-xs text-muted-foreground  mt-4'>
                    Drag and Drop to Reorder the Chapters 
                </p>
            )}
        </div>
    )
}

export default ChaptersForm

