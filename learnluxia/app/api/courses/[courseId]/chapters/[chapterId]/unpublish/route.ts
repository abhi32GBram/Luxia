import { auth } from "@clerk/nextjs"; // For user authentication
import { NextResponse } from "next/server"; // For handling HTTP responses in Next.js
import { db } from "@/lib/db"; // Database access

// Exporting an asynchronous function named PATCH, which is likely meant to handle HTTP PATCH requests
export async function PATCH(
    req: Request, // The HTTP request object
    { params }: { params: { courseId: string; chapterId: string } } // Extracting 'params' from the function arguments
) {
    try {
        // Authenticating the user and getting their userId
        const { userId } = auth();

        // If no userId is found, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Checking if the course belongs to the user
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId, // Using courseId from params
                userId              // Matching the userId to ensure ownership
            }
        });

        // If the course doesn't belong to the user, return a 401 Unauthorized response
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Updating the specified chapter to set it as unpublished
        const unpublishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId, // Using chapterId from params
                courseId: params.courseId, // Ensuring the chapter belongs to the correct course
            },
            data: {
                isPublished: false, // Setting isPublished to false to unpublish it
            }
        });

        // Finding all published chapters in the course
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId, // Filtering by courseId
                isPublished: true,        // Filtering for published chapters only
            }
        });

        // If there are no published chapters left in the course, update the course to be unpublished
        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId, // Filtering by courseId
                },
                data: {
                    isPublished: false, // Setting isPublished to false for the course
                }
            });
        }

        // Returning the unpublished chapter as a JSON response
        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        // Logging the error and returning a 500 Internal Server Error response if an exception occurs
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

