// Importing necessary modules and types
import { db } from "@/lib/db" // Importing database instance
import { Attachment, Chapter } from "@prisma/client" // Importing Attachment and Chapter types from Prisma client

// Defining the properties for the GetChapter function
interface GetChapterProps {
    userId: string // User ID
    courseId: string // Course ID
    chapterId: string // Chapter ID
}

// Exporting the GetChapter function
export const GetChapter = async ({ userId, courseId, chapterId }: GetChapterProps) => {

    try {
        // Finding a unique purchase record based on user ID and course ID
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: courseId
                }
            }
        })

        // Finding a unique course record based on course ID and checking if it's published
        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true // Selecting only the price field
            }
        })

        // Finding a unique chapter record based on chapter ID and checking if it's published
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        })

        // Throwing an error if chapter or course is not found
        if (!chapter || !course) {
            throw new Error("Chapter and/or Course Not Found !! ")
        }

        // Initializing variables
        let muxData = null
        let attachments: Attachment[] = []
        let nextChapter: Chapter | null = null

        // If purchase exists, finding all attachments related to the course
        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            })
        }

        // If chapter is free or purchase exists, finding mux data and next chapter
        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            })

            // Finding the first chapter after the current one in the same course
            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    }
                },
                orderBy: {
                    position: "asc"
                }
            })
        }

        // Finding user progress for the current chapter
        const userPogress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        })

        // Returning all the fetched data
        return { chapter, muxData, attachments, nextChapter, userPogress, purchase, course }

    } catch (error) {
        // Logging any errors that occur during execution
        console.log("[GET_CHAPTER_ACTION]", error)
    }

    // Returning null values if any error occurs
    return {
        chapter: null,
        course: null,
        muxData: null,
        nextChapter: null,
        attachments: [],
        userPogress: null,
        purchase: null
    }
}
