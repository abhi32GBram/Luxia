import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Courses = () => {
  return (

    <Link href="/teacher/create">
      <Button className='p-6'>
        New Course
      </Button>
    </Link>
  )
}

export default Courses