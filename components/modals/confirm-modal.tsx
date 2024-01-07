'use client'

import React from 'react'

// Importing specific components from the 'alert-dialog' module
// These components are used to construct the modal dialog
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader
} from '@/components/ui/alert-dialog'

// Defining the interface for the props that ConfirmModal will accept
interface ConfirmModalProps {
    children: React.ReactNode  // The content to be displayed inside the AlertDialogTrigger
    onConfirm: () => void    // A function to be called when the user confirms the action
}

// Defining the ConfirmModal component
export const ConfirmModal = ({
    children,
    onConfirm
}: ConfirmModalProps) => {
    return (
        // Rendering the AlertDialog component, which acts as the container for the modal
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>

                <AlertDialogHeader>

                    <AlertDialogTitle>Are You Sure ? </AlertDialogTitle>
                    <AlertDialogDescription>The Following Action Cannot Be Undone</AlertDialogDescription>

                </AlertDialogHeader>
                <AlertDialogFooter>

                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmModal
