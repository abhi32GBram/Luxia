"use client"
// Importing necessary modules and components
import React from 'react'; // React library
import { usePathname } from "next/navigation"; // Hook to get the current pathname
import Link from 'next/link'; // Next.js link component
import { UserButton } from '@clerk/nextjs'; // User button component from Clerk
import { Button } from '@/components/ui/button'; // Custom button component
import { LogOut } from 'lucide-react'; // Logout icon
import { SearchInput } from './search-input'; // Search input component


// NavbarRoutes component
const NavbarRoutes = () => {
    // Get the current pathname
    const pathname = usePathname();

    // Check if the current page is a teacher page
    const isTeacherPage = pathname?.startsWith("/teacher");

    // Check if the current page is a course page
    const isCoursePage = pathname?.includes("/courses");

    // Check if the current page is a search page
    const isSearchPage = pathname === "/search";

    // Return the navbar routes
    return (
        <>
            {isSearchPage && ( // If it's a search page, show the search input
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className='flex gap-2 ml-auto'>
                {isTeacherPage || isCoursePage ? ( // If it's a teacher or course page, show the exit button
                    <Link href='/'>
                        <Button size='sm' variant="ghost">
                            <LogOut className='h-4 w-4 mr-2' />
                            Exit
                        </Button>
                    </Link>
                ) : ( // Otherwise, show the instructor mode button
                    <Link href='/teacher/courses'>
                        <Button size="sm" variant="ghost">
                            Instructor Mode
                        </Button>
                    </Link>
                )}
                <UserButton afterSignOutUrl="/" />
            </div>
        </>
    );
}

export default NavbarRoutes;
