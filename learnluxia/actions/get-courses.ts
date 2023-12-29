// Import necessary modules and types
import { db } from "@/lib/db"; // Database connection
import { Category, Course } from "@prisma/client"; // Prisma client models
import { getProgress } from "@/actions/get-progress"; // Function to calculate progress

// Define type for CourseWithProgressWithCategory
type CourseWithProgressWithCategory = Course & {
    category: Category | null; // Category associated with the course
    chapters: { id: string }[]; // Chapters in the course
    progress: number | null; // Progress of the user in the course
};

// Define type for GetCourses function argument
type GetCourses = {
    userId: string; // ID of the user
    title?: string; // Optional title filter
    categoryId?: string; // Optional category filter
};

// Export GetCourses function
export const GetCourses = async ({ userId, title, categoryId }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        // Fetch courses from the database
        const courses = await db.course.findMany({
            where: {
                isPublished: true, // Only fetch published courses
                title: {
                    contains: title // Filter by title if provided
                },
                categoryId // Filter by category if provided
            },
            include: { // Include related data
                category: true,
                chapters: {
                    where: {
                        isPublished: true // Only include published chapters
                    },
                    select: {
                        id: true // Select only the chapter IDs
                    }
                },
                purchases: { // Include purchases made by the user
                    where: {
                        userId
                    }
                }
            },
            orderBy: { // Order the results by creation date
                createdAt: "desc"
            }
        });

        // Calculate progress for each course
        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) { // If the user hasn't purchased the course
                    return {
                        ...course,
                        progress: null, // Set progress to null
                    };
                }

                // Calculate progress percentage
                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage, // Add progress to the course object
                };
            })
        );

        // Return the courses with progress
        return coursesWithProgress;
    } catch (error) {
        // Log any errors and return an empty array
        console.log("[GET_COURSES]", error);
        return [];
    }
};

