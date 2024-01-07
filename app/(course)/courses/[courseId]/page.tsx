// Importing the database instance from the local library
import { db } from "@/lib/db"

// Importing the redirect function from Next.js navigation module
import { redirect } from "next/navigation"

// Defining the CourseIdPage function which is an asynchronous function
const CourseIdPage = async ({ params }: {
    // The function expects an object with a property 'params' which itself is an object with a property 'courseId'
    params: { courseId: string }
}) => {

    // Fetching a unique course from the database using the provided courseId
    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        // Also including the published chapters of the course in the result, ordered by their position
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    })

    // If no course was found with the provided courseId, redirect to the home page
    if (!course) {
        return redirect("/")
    }

    // If a course was found, redirect to the first published chapter of the course
    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}

// Exporting the CourseIdPage function as the default export of this module
export default CourseIdPage
