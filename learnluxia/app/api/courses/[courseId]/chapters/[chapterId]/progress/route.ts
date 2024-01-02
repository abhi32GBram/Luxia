// Import necessary modules and functions
import { db } from "@/lib/db"; // Importing database connection
import { auth } from "@clerk/nextjs"; // Importing authentication module
import { NextResponse } from "next/server"; // Importing NextResponse for server responses

// Define the PUT method for updating user progress
export async function PUT(
    req: Request, // The incoming request
    { params }: { params: { courseId: string; chapterId: string } } // The parameters from the request
) {
    try {
        // Get the user ID from the authenticated user
        const { userId } = auth()
        // Parse the JSON body of the request to get the 'isCompleted' flag
        const { isCompleted } = await req.json()

        // If there is no authenticated user, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Upsert (update or insert) the user progress in the database
        const userProgress = await db.userProgress.upsert({
            where: {
                // Specify the condition for finding the record
                userId_chapterId: {
                    userId, // The user ID
                    chapterId: params.chapterId // The chapter ID
                }
            },
            update: {
                // Specify the fields to be updated
                isCompleted, // The 'isCompleted' flag
            },
            create: {
                // Specify the data for creating a new record
                userId, // The user ID
                chapterId: params.chapterId, // The chapter ID
                isCompleted // The 'isCompleted' flag
            }
        })

        // Return the updated user progress as a JSON response
        return NextResponse.json(userProgress)

    } catch (error) {
        // Log the error
        console.log("[CHAPTER_ID_PROGRESS_ROUTE]", error)
        // Return a 500 Internal Server Error response in case of any errors
        return new NextResponse("Internal Error Occurred ", { status: 500 })
    }
}
