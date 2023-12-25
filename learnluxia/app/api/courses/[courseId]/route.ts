// Importing the required modules
import Mux from "@mux/mux-node"; // Importing the Mux Node.js SDK
import { auth } from "@clerk/nextjs"; // Importing the Clerk authentication module
import { NextResponse } from "next/server"; // Importing the Next.js server response object
import { db } from "@/lib/db"; // Importing the database connection

// Initializing the Mux SDK with your Mux Token ID and Secret
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!, // Your Mux Token ID
    process.env.MUX_TOKEN_SECRET!, // Your Mux Token Secret
);

// DELETE function
export async function DELETE(
    req: Request, // The incoming HTTP request
    { params }: { params: { courseId: string } } // The route parameters
) {
    try {
        // Getting the authenticated user's ID
        const { userId } = auth();

        // If there is no authenticated user, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Finding the course in the database
        const course = await db.course.findUnique({
            where: {
                id: params.courseId, // The ID of the course to find
                userId: userId, // The ID of the authenticated user
            },
            include: {
                chapters: {
                    include: {
                        muxData: true, // Including the Mux data for each chapter
                    }
                }
            }
        });

        // If the course does not exist, return a 404 Not Found response
        if (!course) {
            return new NextResponse("Resources Not found", { status: 404 });
        }

        // Looping through each chapter of the course
        for (const chapter of course.chapters) {
            // If the chapter has a Mux asset ID, deleting the asset
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId);
            }
        }

        // Deleting the course from the database
        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId, // The ID of the course to delete
            },
        });

        // Returning the deleted course as a JSON response
        return NextResponse.json(deletedCourse);
    } catch (error) {
        // Logging the error and returning a 500 Internal Server Error response
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error Occurred", { status: 500 });
    }
}

// PATCH function
export async function PATCH(
    req: Request, // The incoming HTTP request
    { params }: { params: { courseId: string } } // The route parameters
) {
    try {
        // Getting the authenticated user's ID
        const { userId } = auth();
        const { courseId } = params; // The ID of the course to update
        const values = await req.json(); // The new values for the course

        // If there is no authenticated user, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Updating the course in the database
        const course = await db.course.update({
            where: {
                id: courseId, // The ID of the course to update
                userId
            },
            data: {
                ...values, // The new values for the course
            }
        });

        // Returning the updated course as a JSON response
        return NextResponse.json(course);
    } catch (error) {
        // Logging the error and returning a 500 Internal Server Error response
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
