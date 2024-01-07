// Import necessary modules and dependencies
'use client';
import React from 'react';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ghost, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

import { Chapter, Course } from '@prisma/client';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';

// Define the properties for the ChapterDescriptionForm component
interface ChapterDescriptionFormProps {
    initialData: Chapter;  // Initial data for the chapter
    courseId: string;     // ID of the course
    chapterId: string;    // ID of the chapter
}

// Define a schema for form validation using Zod
const formSchema = z.object({
    description: z.string().min(1),  // Description should be a non-empty string
});

// Create the ChapterDescriptionForm component
const ChapterDescriptionForm = ({
    initialData, courseId, chapterId
}: ChapterDescriptionFormProps) => {
    // State to manage whether the user is editing
    const [isEditing, setisEditing] = useState(false);

    // Function to toggle the edit mode
    const toggleEdit = () => {
        setisEditing((current) => !current);
    }

    // Access the Next.js router
    const router = useRouter();

    // Create a form with React Hook Form and Zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "",  // Set the initial description value
        }
    });

    // Destructure form state for validation
    const { isSubmitting, isValid } = form.formState;

    // Function to handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Send a PATCH request to update the chapter description
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

            // Show a success toast message
            toast.success("Chapter Update Successfully");

            // Exit edit mode and refresh the router
            toggleEdit();
            router.refresh();
        } catch {
            // Show an error toast message in case of an error
            toast.error("Something Went Wrong");
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit Description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic "
                )}>
                    {!initialData.description && "No Description"}
                    {initialData.description && (
                        <Preview value={initialData.description} />
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField control={form.control} name='description' render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Editor {...field} />
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

export default ChapterDescriptionForm;
