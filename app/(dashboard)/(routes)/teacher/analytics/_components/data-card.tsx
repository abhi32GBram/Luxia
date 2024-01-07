// Import necessary components and utilities
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceFormat } from '@/lib/format'
import React from 'react'

// Define the properties that the DataCard component expects
interface DataCardProps {
    value: number // The value to display in the card
    label: string // The label to display above the value
    shouldFormat?: boolean // Optional flag indicating whether the value should be formatted
}

// Define the DataCard component
export const DataCard = ({ value, label, shouldFormat }: DataCardProps) => {
    // Return the JSX for the DataCard component
    return (
        <Card>
            <CardHeader className=' flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium' >
                    {label} 
                </CardTitle>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        {shouldFormat ? PriceFormat(value) : value}
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    )
}