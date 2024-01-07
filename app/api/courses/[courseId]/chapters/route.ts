// Import necessary modules and dependencies
import { db } from "@/lib/db"; // Database-related module
import { auth } from "@clerk/nextjs"; // User authentication module
import { NextResponse } from "next/server"; // HTTP response module

// Define an asynchronous function to handle HTTP POST requests
export async function POST(
    req: Request, // HTTP request object
    { params }: { params: { courseId: string } } // Destructured 'params' object containing 'courseId' parameter
) {
    try {
        // Authenticate the user and extract their 'userId'
        const { userId } = auth();
        const { title } = await req.json(); // Extract 'title' from the HTTP request body

        // Check if the user is authenticated, if not, return an "Unauthorized" response with status code 401
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the user is the owner of the specified course ('courseId')
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        // If the user is not the owner, return an "Unauthorized" response with status code 401
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Find the last chapter of the course to determine the position of the new chapter
        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        // Calculate the position of the new chapter; set it to one more than the last chapter's position (or 1 if no chapters exist)
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        // Create a new chapter in the database with the specified 'title', 'courseId', and 'position'
        const chapter = await db.chapter.create({
            data: {
                title: title, // Use the 'title' variable you already extracted
                courseId: params.courseId, // 'courseId' from the URL parameters
                position: newPosition, // Calculated position
            },
        });

        // Return a JSON response containing the newly created chapter
        return NextResponse.json(chapter);
    } catch (error) {
        // If an error occurs during the process, log the error and return an "Internal Error Occurred" response with status code 500
        console.log("CHAPTERS", error);
        return new NextResponse("Internal Error Occurred", { status: 500 });
    }
}

