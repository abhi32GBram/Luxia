// Importing necessary components and types
import NavbarRoutes from '@/components/navbar-routes' // Component for navigation routes
import { Chapter, Course, UserProgress } from '@prisma/client' // Prisma client types
import React from 'react' // React library
import { CourseMobileSidebar } from './course-mobile-sidebar' // Mobile sidebar component for course

// Interface for the props of the CourseNavbar component
interface CourseNavbarProps {
    course: Course & { // The course object
        chapters: (Chapter & { // The chapters array
            userProgress: UserProgress[] | null // The user's progress on each chapter
        })[]
    }
    progressCount: number // The total progress count
}

// CourseNavbar component
export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
    return (
        <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
            <CourseMobileSidebar course={course} progressCount={progressCount} />
            <NavbarRoutes />
        </div>
    )
}
