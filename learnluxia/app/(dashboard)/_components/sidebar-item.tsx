'use client'
import React from 'react'
import {LucideIcon} from 'lucide-react'
import {usePathname, useRouter} from 'next/navigation'

interface SidebarItemsProps { 
    icon: LucideIcon,
    label:string,
    href:string
}
const SidebarItem = ({icon : Icon, label,href} :SidebarItemsProps)   => {
    const pathname = usePathname()
    const router = useRouter()
  return (

    <div>sidebar-item</div>
  )
}

export default SidebarItem