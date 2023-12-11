// Import the 'auth' module from '@clerk/nextjs', which is used for authentication purposes.
import { auth } from "@clerk/nextjs";

// Import 'NextResponse' from 'next/server' to create responses in Next.js API routes.
import { NextResponse } from "next/server";

// Import the database ('db') from a local file, used for database operations.
import { db } from "@/lib/db";

// Export an asynchronous function named 'PUT' which represents a PUT HTTP method.
// It receives 'req' (the request object) and 'params' (URL parameters).
export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; } }
) {
    try {
        // Retrieve the 'userId' from the authentication module.
        // This is used to identify the current user.
        const { userId } = auth();

        // If there is no 'userId', return a 401 Unauthorized response.
        if (!userId) {
            return new NextResponse("Unauthorized Access ", { status: 401 });
        }

        // Parse the request body to get 'list', which is expected to be an array.
        const { list } = await req.json();

        // Query the database to check if the course with the given 'courseId' belongs to the current user.
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        // If the course doesn't belong to the user, return a 401 Unauthorized response.
        if (!ownCourse) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        // Loop through each item in the 'list' and update the 'chapter' in the database.
        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        }

        // After successfully updating the chapters, return a 200 OK response with a success message.
        return new NextResponse("Chapters Reordered Successfully", { status: 200 });
    } catch (error) {
        // Log the error and return a 500 Internal Server Error response in case of any exceptions.
        console.log("REORDER", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
