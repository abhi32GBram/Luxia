// Importing necessary modules and components
import { db } from "@/lib/db"; // Database connection
import { auth } from "@clerk/nextjs"; // Authentication module
import { Chapter, Course, UserProgress } from "@prisma/client"; // Prisma client models
import { checkPrime } from "crypto"; // Cryptographic functions
import { redirect } from "next/navigation"; // Navigation functions
import { CourseSidebarItem } from "./course-sidebar-item"; // Sidebar item component

// Interface for CourseSidebar props
interface CourseSidebarProps {
    course: Course & { // Course object with additional chapters property
        chapters: (Chapter & { // Chapters array with additional userProgress property
            userProgress: UserProgress[] | null // Array of UserProgress objects or null
        })[]
    },
    progressCount: number // Number of progress items
}

// CourseSidebar component
export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {

    // Get the authenticated user's ID
    const { userId } = auth();
    // If no user is authenticated, redirect to home page
    if (!userId) {
        return redirect("/");
    }

    // Find the unique purchase record for the current user and course
    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    });

    // Return the sidebar component
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-md">
            <div className=" p-8 flex flex-col border-b">
                <h1 className=" font-semibold">
                    {course.title} 
                </h1>
                {/* Check if the course has been purchased and display the progress bar */}
            </div>
            <div className=" flex flex-col w-full">
                {course.chapters.map((chapter) => ( // Map over the chapters in the course
                    <CourseSidebarItem // For each chapter, render a CourseSidebarItem
                        label={chapter.title} // Pass the chapter title as the label
                        key={chapter.id} // Use the chapter ID as the key
                        id={chapter.id} // Pass the chapter ID
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted} // Check if the first user progress item exists and is completed
                        courseId={course.id} // Pass the course ID
                        isLocked={chapter.isFree && !purchase} // Check if the chapter is free and not purchased
                    />
                ))}
            </div>
        </div>
    );
}
