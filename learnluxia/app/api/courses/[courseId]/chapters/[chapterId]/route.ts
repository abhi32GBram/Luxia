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
