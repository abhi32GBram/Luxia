// Import necessary libraries and modules
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
//import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
    try {
        // Extract userId from the request
        const { userId } = auth();
        // Extract title from the request body
        const { title } = await req.json();

        // Check if userId exists and if the user is a teacher
        if (!userId) {
            // If not, return an Unauthorized response
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Create a new course in the database
        const course = await db.course.create({
            data: {
                userId,
                title,
            },
        });

        // Return the newly created course as a JSON response
        return NextResponse.json(course);
    } catch (error) {
        // Log any errors that occur during the process
        console.log("[COURSES]", error);
        // Return an Internal Error response if an exception is thrown
        return new NextResponse("Internal Error", { status: 500 });
    }
}