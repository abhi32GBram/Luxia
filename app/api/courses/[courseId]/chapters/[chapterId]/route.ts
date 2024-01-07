// Importing necessary modules and libraries
import { db } from "@/lib/db"; // Database access module
import { auth } from "@clerk/nextjs"; // Authentication module from Clerk
import { NextResponse } from "next/server"; // Response utility from Next.js

// Importing the Mux SDK for video asset management
import Mux from '@mux/mux-node';
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!, // Mux API token ID
    process.env.MUX_TOKEN_SECRET!, // Mux API token secret
);

// Exporting an asynchronous function named DELETE
// This function is a handler for an HTTP DELETE request
export async function DELETE(
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
                userId,             // Ensuring the course belongs to the authenticated user
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

        // If the chapter is not found, return a 404 Not Found response
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // If the chapter has an associated video, handle video deletion
        if (chapter.videoUrl) {
            // Finding Mux data related to the chapter
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            // If Mux data is found, delete the associated video and Mux data
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId); // Deleting the video asset
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        // Deleting the chapter from the database
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        // Checking if there are any published chapters left in the course
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        // If there are no published chapters left, update the course to be unpublished
        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        // Returning the deleted chapter as a JSON response
        return NextResponse.json(deletedChapter);
    } catch (error) {
        // Logging the error and returning a 500 Internal Error response if an exception occurs
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


// The PATCH function to update chapter information
export async function PATCH(
    req: Request, // The request object
    { params }: { params: { courseId: string; chapterId: string } } // Destructuring params from the request
) {
    try {
        // Getting the user ID from the auth module
        const { userId } = auth();

        // Extracting data from the request body
        const { isPublished, ...values } = await req.json();

        // Check for authorized user
        if (!userId) {
            // Return 401 Unauthorized if no user ID is found
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        // Check if the user is the owner of the course
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        // Return 401 Unauthorized if the user is not the course owner
        if (!courseOwner) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        // Update the chapter with the provided values
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        });

        // If a video URL is provided in the update
        if (values.videoUrl) {
            // Look for existing Mux data for the chapter
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            // If Mux data exists, delete the old video asset and data
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }

            // Create a new Mux asset with the provided video URL
            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false
            });

            // Create a new Mux data entry in the database
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id ?? "defaultPlaybackId", // Safeguard against undefined playback ID
                }
            });
        }

        // Return the updated chapter data as a response
        return NextResponse.json(chapter);
    } catch (error) {
        // Log the error and return a 500 Internal Server Error response
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error Occured ", { status: 500 });
    }
}
