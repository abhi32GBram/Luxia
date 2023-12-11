// Directive to inform the Next.js compiler that this module is for client-side only.
'use client'

// Standard React import statement.
import React from 'react'

// Import zod, a schema validation library, to define and enforce structure of data.
import * as z from "zod"
// Import zodResolver to integrate zod with react-hook-form.
import {zodResolver} from "@hookform/resolvers/zod"

// Import useRouter from 'next/navigation', a mistake in the comment as it should be from 'next/router'.
import { useRouter } from 'next/navigation' 
// Import Link component from Next.js for client-side navigation.
import Link from 'next/link'
// Import toast for showing notifications.
import toast from 'react-hot-toast'

// Import useForm from 'react-hook-form' for handling form states and validation.
import {useForm} from "react-hook-form"
// Import various form-related components for building the UI.
import { Form, FormControl, FormDescription, FormLabel, FormField, FormMessage, FormItem } from '@/components/ui/form'
// Import Button component for creating buttons.
import { Button } from '@/components/ui/button'
// Import Input component for creating input fields.
import { Input } from '@/components/ui/input'

// Import axios for making HTTP requests.
import axios from "axios"

// Define a schema for the form using zod.
const formSchema = z.object({
    title: z.string().min(1, {
        message:"Title is Required"
    }),
})

// CreatePage is a React functional component.
const CreatePage = () => {
    // Use useRouter hook for navigating programmatically.
    const router = useRouter()
    // Initialize the form with useForm hook and zod schema.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    // Destructure form states for use in the component.
    const { isSubmitting, isValid } = form.formState
    // Define onSubmit function for form submission.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Make a POST request to create a course.
            const response = await axios.post("/api/courses", values)
            // Redirect to the created course's page.
            router.push(`/teacher/courses/${response.data.id}`)
            // Show success message.
            toast.success("Course Created !! ")
        } catch {
            // Show error message in case of failure.
            toast.error("Something Went Wrong ")
        }
    }

    // Return JSX for rendering the component.
    return (
        <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 '>
            <div>
                <h1 className='text-2xl font-medium-bold  '>
                    Name your Course
                </h1>
                <p className='text-sm text-slate-600'>
                    What would you like to Name your Course? Don&apos;t worry, you can change this later...
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=' space-y-8 mt-8'>
                        <FormField control={form.control} name='title' render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Course Title 
                                </FormLabel>
                                <FormControl>
                                    <Input  disabled={isSubmitting} placeholder="Eg.: 'Advanced Machine Learning Course'" {...field}/>
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                                <FormMessage  />
                            </FormItem>
                        )}/>
                        <div className='flex items-center gap-x-2'>
                            <Link href="/">
                                <Button variant="ghost" type='button'>
                                    Cancel 
                                </Button>
                            </Link>
                            <Button type='submit' disabled={!isValid || isSubmitting}>
                                Continue 
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

// Export the component for use in other parts of the application.
export default CreatePage
