'use client'
import React from 'react'

import {usePathname , useRouter} from "next/navigation"
import Link from 'next/link'

import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {  LogOut } from 'lucide-react'

const NavbarRoutes = () => {
    const pathname = usePathname()
    const router = useRouter()

    const isTeacherPage = pathname?.startsWith("/teacher")

    // THIS PAGE WILL BE FOR THE INDIVIDUAL PLAYERS OF THE CONTENT OF THE COURSE
    const isPlayerPage = pathname?.includes("/chapter")

return (
    <div className='flex gap-2 ml-auto'>
        {isTeacherPage || isPlayerPage ? ( 
            <Button size='sm' variant="ghost">
                <LogOut className='h-4 w-4 mr-2'/>
                Exit 
            </Button>
        ) : (
            <Link href='/teacher/courses'>
                <Button size='sm' variant="ghost">
                    Instructor Mode 
                </Button>
            </Link>
        )}   
        <UserButton  
            afterSignOutUrl='/'
        />        
    </div>
    )
}


export default NavbarRoutes
