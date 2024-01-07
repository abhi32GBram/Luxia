// Importing necessary types and components
import { Chapter, Course, UserProgress } from "@prisma/client"; // Prisma client types

import { Menu } from "lucide-react"; // Icon component

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // UI components
import { CourseSidebar } from "./course-sidebar"; // Sidebar component for course

// Interface for the props of the CourseMobileSidebar component
interface CourseMobileSidebarProps {
    course: Course & { // The course object
        chapters: (Chapter & { // The chapters array
            userProgress: UserProgress[] | null // The user's progress on each chapter
        })[]
    }
    progressCount: number // The total progress count
}

// CourseMobileSidebar component
export const CourseMobileSidebar = ({ course, progressCount }: CourseMobileSidebarProps) => {
    return (
        <div>
            <Sheet>
                <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transititon">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className=" p-0 bg-white w-73">
                    <CourseSidebar course={course} progressCount={progressCount} />
                </SheetContent>
            </Sheet>
        </div>
    )
}
