import React from 'react';
// Import the 'auth' module from '@clerk/nextjs' for user authentication.
import { auth } from '@clerk/nextjs';
// Import 'Link' and 'redirect' from 'next' for navigation.
import Link from 'next/link';
import { redirect } from 'next/navigation';
// Import the 'db' module from '@/lib/db' for database operations.
import { db } from '@/lib/db';
// Import icons and components for use in the page.
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
// Import components for editing chapter details.
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterVideoForm from './_components/chapter-video-form';
import Banner from '@/components/banner';
import ChapterActions from './_components/chapter-actions';


// Define an asynchronous function for the Chapter page, receiving parameters.
const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  // Authenticate the user and extract the 'userId'.
  const { userId } = auth();
  if (!userId) {
    // If the user is not authenticated, redirect to the homepage.
    redirect('/');
  }

  // Find the chapter by its 'chapterId' and 'courseId', including muxData.
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
    include: {
      muxData: true,
    },
  });

  // If the chapter doesn't exist, redirect to the homepage.
  if (!chapter) {
    return redirect('/');
  }

  // Define an array of required fields in the chapter.
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];
  // Calculate the total number of fields and the number of completed fields.
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  // Generate a completion text to display the progress.
  const completetionText = `(${completedFields}/${totalFields})`;

  // Making sure that all of the field in requiredFields is True
  const isComplete = requiredFields.every(Boolean)

  return (
    // Wrapped the entire render with a check for if the Chapter is Published, then show a warning that it isn't yet
    <>
      {!chapter.isPublished && (
        <Banner variant='warning' label='This Chapter is Unpublished & will not be visible in the Course' />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <Link href={`/teacher/courses/${params.courseId}`} className='flex items-center text-sm hover:opacity-75 transition'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Course Setup
            </Link>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-semibold'>
                Chapter Creation
              </h1>
              <span className='text-sm text-slate-700'>
                {/* Display the completion text for fields. */}
                Complete all the Fields {completetionText}
              </span>
            </div>
          </div>
          <div>
            <ChapterActions disabled={!isComplete} courseId={params.courseId} chapterId={params.chapterId} isPublished={chapter.isPublished} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2 '>
                <IconBadge icon={LayoutDashboard} />
                <h2 className='text-xl'>
                  Customize your Chapter
                </h2>
              </div>
              <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
              <ChapterDescriptionForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
            </div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={Eye} />
              <h2 className='text-xl'>
                Access Chapter Settings
              </h2>
            </div>
            <ChapterAccessForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={Video} />
              <h2 className='text-xl'>
                Add your Video
              </h2>
            </div>
            <ChapterVideoForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
          </div>
        </div>
      </div>
    </>
  );
}

// Export the ChapterIdPage component as the default export.
export default ChapterIdPage;

//5 57