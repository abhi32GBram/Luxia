import { GetChapter } from '@/actions/get-chapter';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { VideoPlayer } from './_components/video-player';

// Defining the ChapterIdPage function which is an asynchronous function
const ChapterIdPage = async ({
    params
}: {
    // The function expects an object with a property 'params' which itself is an object with properties 'courseId' and 'chapterId'
    params: { courseId: string; chapterId: string }
}) => {

    // Getting the userId from the auth function
    const { userId } = auth()

    // If no userId is found, redirect to the home page
    if (!userId) {
        return redirect("/")
    }

    // Calling the GetChapter action with the userId, chapterId, and courseId to fetch the chapter, course, Mux data, attachments, next chapter, user progress, and purchase
    const { chapter, course, muxData, attachments, nextChapter, userPogress, purchase } = await GetChapter({
        userId, chapterId: params.chapterId, courseId: params.courseId
    })

    // If no chapter or course is found, redirect to the home page
    if (!chapter || !course) {
        return redirect("/")
    }

    // Checking if the chapter is locked (i.e., not free and not purchased)
    const isLocked = !chapter.isFree && !purchase

    // Checking if the chapter should be marked as completed at the end (i.e., if the course is purchased and not already marked as completed)
    const completeOnEnd = !!purchase && !userPogress?.isCompleted

    // Returning a JSX element representing the chapter page
    return (
        <div>
            {/* Displaying a banner if the chapter is already completed */}
            {userPogress?.isCompleted && (
                <Banner label='You Already Completed this Chapter' variant="success" />
            )}
            {/* Displaying a banner if the chapter is locked */}
            {isLocked && (
                <Banner label='You Need to Purchase the Course to View this Chapter' variant="warning" />
            )}
            <div className='flex flex-col max-w-4xl mx-auto pb-20'>
                <div className='p-4'>
                    {/* Rendering the VideoPlayer component with the necessary props */}
                    <VideoPlayer
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd} />
                </div>
            </div>
        </div>
    )
}

// Exporting the ChapterIdPage function as the default export of this module
export default ChapterIdPage
