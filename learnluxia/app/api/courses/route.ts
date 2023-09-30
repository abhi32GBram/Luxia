import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// THIS ROUTE IS FINE BUT CAN HAVE
// import { db } from "@/lib/db"
// import { auth } from "@clerk/nextjs"
// import { NextResponse } from "next/server"

// export async function POST(
//     req:Request,)
//     {
//         try {
//             const {userId}  = auth()
//             const {title } = await req.json()

//             if(!userId){
//                 return new NextResponse("Unauthorized !! ",{status : 401 })
//             }

//             const course = await db.course.create({
//                 data:{
//                     userId,
//                     title,
//                     imageURL: "default-image-url" // THIS LINE COULD'VE BEEN ADDED DUE TO SOME TYPE ERROR FOR THE DEFAULT TYPE MENTIONED IN errors FILE

//                 }
//             })

//         } catch (error) {
//             console.log("[COURSES API]",error)
//             return new NextResponse("Internal Error Occured ",{status: 500})
//         }
//     }
// }
