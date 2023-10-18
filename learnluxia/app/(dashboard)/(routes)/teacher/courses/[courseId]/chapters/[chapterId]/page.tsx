import React from 'react'

import { auth } from '@clerk/nextjs';

import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

import Link from 'next/link';
import { Chau_Philomene_One, Pragati_Narrow } from 'next/font/google';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import ChapterTitleForm from './_components/chapter-title-form';
import { checkPrime } from 'crypto';

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string ; chapterId: string }
}) => {
  const { userId } = auth()
  if(!userId){
    redirect("/")
  }

  const chapter = await db.chapter.findUnique({
    where : {
      id : params.chapterId,
      courseId : params.courseId
    },
    include : {
      muxData : true,
    },
  })

  if(!chapter){
    return redirect("/")
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completetionText  = `(${completedFields}/${totalFields})`
  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='w-full'>
          <Link href={`/teacher/courses/${params.courseId}`} className=' flex items-center text-sm hover:opacity-75 transition mb-8'>
            <ArrowLeft className='h-4 w-4 mr-2'/> 
            Back to Course Setup
          </Link>
          <div className='flex items-center justify-center w-full'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-semibold'>Chapter Creation </h1>
              <span className='text-sm text-slate-700'>
                Complete all the Fields {completetionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-x-2 '>
              <IconBadge icon={LayoutDashboard}/>
              <h2 className='text-xl'>
                Customize your Chapter 
              </h2>
            </div>
            <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage  

// http://localhost:3000/teacher/courses/846f68d8-86f4-4ee5-a5ff-4549331955fb