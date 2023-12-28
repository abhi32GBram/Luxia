import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { count } from "console"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth()
        const { url } = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized Access", { status: 401 })
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId

            }
        })
        return NextResponse.json(attachment)
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENT", error)
        return new NextResponse("Internal Error Occured ", { status: 500 })
    }
}