// // Importing the 'auth' object from '@clerk/nextjs' package
// import { auth } from "@clerk/nextjs"
// // Importing the 'NextResponse' class from 'next/server' package
// import { NextResponse } from "next/server"

// // Importing the 'db' object from '@/lib/db' module
// import { db } from "@/lib/db"

// // Exporting an asynchronous function named 'PATCH'
// export async function PATCH(
//     // The first parameter is the request object
//     req: Request,
//     // The second parameter is an object containing parameters
//     { params }: { params: { courseId: string } }
// ) {
//     try {
//         // Getting the 'userId' from the 'auth' object
//         const { userId } = auth()
//         // If 'userId' does not exist, return a new response with status 401 and message "Unauthorized Access !!"
//         if (!userId) {
//             return new NextResponse("Unauthorized Access !!", { status: 401 })
//         }

//         // Finding a unique course in the database using the 'courseId' and 'userId'
//         const course = await db.course.findUnique({
//             where: {
//                 id: params.courseId,
//                 userId
//             },
//             // Including related 'chapters' and their 'muxData' in the result
//             include: {
//                 chapters: {
//                     include: {
//                         muxData: true
//                     }
//                 }
//             }
//         })

//         // If no course is found, return a new response with status 404 and message "Resource Not Found !"
//         if (!course) {
//             return new NextResponse("Resource Not Found !", { status: 404 })
//         }

//         // Checking if any chapter of the course is published
//         const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished)

//         // If any required field is missing, return a new response with status 401 and message "Missing Required Fields !"
//         if (!course.title || !course.title || !course.imageUrl || !hasPublishedChapter || !course.categoryId) {
//             return new NextResponse("Missing Required Fields !", { status: 401 })
//         }

//         // Updating the course in the database to set 'isPublished' to true
//         const publishedCourse = await db.course.update({
//             where: {
//                 id: params.courseId,
//                 userId
//             },
//             data: {
//                 isPublished: true
//             }
//         })

//         // Returning the updated course as a JSON response
//         return NextResponse.json(publishedCourse)
//     } catch (error) {
//         // Logging the error if any occurs during execution
//         console.log("[COURSE_ID_PUBLISH]", error)
//         // Returning a new response with status 500 and message "Internal Error Occurred"
//         return new NextResponse("Internal Error Occurred", { status: 500 })
//     }
// }


import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Missing required fields", { status: 401 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}