// Import necessary modules and types
import { db } from "@/lib/db"
import { Category, Chapter, Course } from "@prisma/client"
import { getProgress } from "@/actions/get-progress"

// Define the type for a course with progress and category
type CourseWithProgressWithCategory = Course & {
    category: Category
    chapters: Chapter[]
    progress: number | null
}

// Define the type for dashboard courses
type DashboardCourses = {
    completedCourses: CourseWithProgressWithCategory[]
    coursesInProgress: CourseWithProgressWithCategory[]
}

// Function to get dashboard courses
export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        // Find all purchases for the given user
        const purchasedCourses = await db.purchase.findMany({
            where: {
                userId: userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        })

        // Map over the purchasedCourses array and extract the course object from each purchase
        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[]

        // Iterate over each course
        for (let course of courses) {
            // Get the progress of the course for the current user
            const progress = await getProgress(userId, course.id)
            // Assign the progress to the course object
            course["progress"] = progress
        }

        // Filter out the courses that the user has completed
        const completedCourses = courses.filter((course) => course.progress === 100)
        // Filter out the courses that the user is still working on
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100)

        // Return an object containing the completed and in-progress courses
        return {
            completedCourses,
            coursesInProgress
        }

    } catch (error) {
        // Log any errors that occur during execution
        console.log("[GET_DASHBOARD_COURSES_ACTION]", error)
        // Return an empty object if an error occurs
        return {
            completedCourses: [],
            coursesInProgress: []
        }
    }
}