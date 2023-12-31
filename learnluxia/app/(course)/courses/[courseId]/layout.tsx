// Importing necessary functions and components
import { getProgress } from '@/actions/get-progress'; // Function to get user progress
import { db } from '@/lib/db'; // Database connection
import { auth } from '@clerk/nextjs'; // Authentication module
import { redirect } from 'next/navigation'; // Navigation redirection function

import { CourseSidebar } from './_components/course-sidebar'; // Sidebar component for course
import { CourseNavbar } from './_components/course-navbar'; // Navbar component for course

// CourseLayout component
const CourseLayout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {

    // Get the authenticated user's ID
    const { userId } = auth()

    // If no user is authenticated, redirect to home page
    if (!userId) {
        return redirect("/")
    }

    // Fetch the course data from the database
    const course = await db.course.findUnique({
        where: {
            id: params.courseId // Use the course ID from the parameters
        },
        include: {
            chapters: {
                where: {
                    isPublished: true // Only include published chapters
                },
                include: {
                    userProgress: { // Include user progress for each chapter
                        where: {
                            userId // Filter by the authenticated user's ID
                        }
                    }
                },
                orderBy: {
                    position: "asc" // Order the chapters in ascending order
                }
            }
        }
    })

    // If no course is found, redirect to home page
    if (!course) {
        return redirect("/")
    }

    // Get the user's progress on the course
    const progressCount = await getProgress(userId, course.id)

    // Return the layout for the course
    return (
        <div className='h-full'>
            <div className=' h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
                <CourseNavbar course={course} progressCount={progressCount} /> 
            </div>
            <div className='hidden md:flex h-full w-80 flex-col fixed -inset-y-0 z-50'>
                <CourseSidebar course={course} progressCount={progressCount} /> 
            </div>
            <main className='md:pl-80 pt-[80px] h-full'>
                {children}
            </main>
        </div>
    )
}

// Export the CourseLayout component
export default CourseLayout
