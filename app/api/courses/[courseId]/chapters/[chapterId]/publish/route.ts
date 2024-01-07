// Importing necessary modules and functions
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Exporting an asynchronous PATCH function, for handling HTTP PATCH requests
export async function PATCH(
    req: Request, // The HTTP request object
    { params }: { params: { courseId: string; chapterId: string } } // Destructuring to extract 'params' from the second argument
) {
    try {
        // Attempting to authenticate the user and get their userId
        const { userId } = auth();

        // If no userId is found, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Checking if the course belongs to the user
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId, // Using courseId from the params to find the course
                userId              // Ensuring the course belongs to the authenticated user
            }
        });

        // If the course doesn't belong to the user, return a 401 Unauthorized response
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Finding the specific chapter in the course
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId, // Using chapterId from the params to find the chapter
                courseId: params.courseId, // Ensuring the chapter belongs to the correct course
            }
        });

        // Finding associated muxData for the chapter
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId, // Using chapterId to find muxData
            }
        });

        // Check for the presence of required fields in the chapter
        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Updating the chapter to set it as published
        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true, // Setting isPublished to true
            }
        });

        // Returning the updated chapter as a JSON response
        return NextResponse.json(publishedChapter);
    } catch (error) {
        // Logging the error and returning a 500 Internal Error response if an exception occurs
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
