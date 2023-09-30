import React from 'react'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

import { redirect } from 'next/navigation'

import { IconBadge } from '@/components/icon-badge'
import { LayoutDashboard } from 'lucide-react'
import TitleForm from './_components/title-form'


const CourseID = async ({ params }: {
    params: { courseId: string }
}) => {
    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }
    const course = await db.course.findUnique({
        where: {
            id: params.courseId

        }
    })
    if (!course) {
        return redirect("/")
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`
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
                        <h2 className='text-xl'>
                            Customize you're Course
                        </h2 >
                    </div>
                    <TitleForm initialData = {course} courseId={course.id}/>
                </div>
            </div>
        </div>
    )
}

export default CourseID