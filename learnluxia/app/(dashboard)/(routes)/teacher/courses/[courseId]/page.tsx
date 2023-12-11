// Standard React import.
import React from 'react'

// Importing a database utility for database operations.
import { db } from '@/lib/db'
// Importing the auth module from '@clerk/nextjs' for authentication purposes.
import { auth } from '@clerk/nextjs'

// Importing the redirect utility from 'next/navigation' for client-side navigation.
import { redirect } from 'next/navigation'

// Importing a custom IconBadge component for displaying icons.
import { IconBadge } from '@/components/icon-badge'

// Importing icons from 'lucide-react' for use within the UI.
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'

// Importing various form components specific to different aspects of the course creation process.
import TitleForm from './_components/title-form'
import DescriptionForm from './_components/description-form'
import ImageForm from './_components/image-form'
import CategoryForm from './_components/category-form'
import PriceForm from './_components/price-form'
import AttachmentForm from './_components/attachment-form'
import ChaptersForm from './_components/chapters-form'

// CourseID is a functional component responsible for handling the course editing interface.
const CourseID = async ({ params }: {
    params: { courseId: string }
}) => {
    // Getting the userId from the auth module to identify the current user.
    const { userId } = auth()

    // Redirecting to the homepage if the user is not authenticated.
    if (!userId) {
        return redirect("/")
    }

    // Fetching course details from the database based on the courseId and userId.
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        // Including related chapters and attachments with specific order.
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc"
                },
            },
        },
    })

    // Fetching categories for the course from the database.
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    // Redirecting to the homepage if the course is not found.
    if (!course) {
        return redirect("/")
    }

    // Checking for the completion status of required fields in the course.
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ]

    // Calculating the total and completed fields for display purposes.
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length

    // Formatting completion text for display.
    const completionText = `(${completedFields}/${totalFields})`

    // JSX for rendering the component.
    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-semibold'>Setting Up the Course</h1>
                    <span className='text-sm text-slate-600'>Complete all the Fields {completionText}</span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl font-medium'>
                            Customize your Course
                        </h2 >
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm initialData={course} courseId={course.id} options={categories.map((category) => ({
                        label: category.name,
                        value: category.id
                    }))} />

                </div>
                <div className='space-y-6'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={ListChecks} />
                            <h2 className='text-xl font-medium'>
                                Course Chapters
                            </h2>
                        </div>
                        <ChaptersForm initialData={course} courseId={course.id} />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className='text-xl font-medium'>
                                Sell your Course
                            </h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                    </div>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={File} />
                            <h2 className='text-xl font-medium'>
                                Resources & Attachments (Optional)
                            </h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseID
