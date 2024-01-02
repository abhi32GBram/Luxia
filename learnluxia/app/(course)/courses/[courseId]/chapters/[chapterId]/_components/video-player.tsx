"use client"

// Import necessary libraries and components
import { useConfettiStore } from "@/hooks/use-confetti-store"
import { cn } from "@/lib/utils"
import MuxPlayer from "@mux/mux-player-react"
import axios from "axios"
import { Loader2, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

// Define the props for the VideoPlayer component
interface VideoPlayerProps {
    chapterId: string
    title: string
    courseId: string
    nextChapterId?: string
    playbackId: string
    isLocked: boolean
    completeOnEnd: boolean
}


export const VideoPlayer = ({ chapterId, title, courseId, nextChapterId, playbackId, isLocked, completeOnEnd }: VideoPlayerProps) => {

    // State variable to track if the video player is ready
    const [isReady, setIsReady] = useState(false)

    const router = useRouter()
    const confetti = useConfettiStore()

    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: true })
            }

            if (!nextChapterId) {
                confetti.onOpen()
            }

            toast.success("Progress Updated")
            router.refresh()

            if (nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
        } catch {
            toast.error("Something Went Wrong ")
        }
    }

    // Return the JSX for the VideoPlayer component
    return (
        <div className="relative aspect-video">
            {/* Show loader while the video is not ready and not locked */}
            {!isReady && !isLocked && (
                <div className=" absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-9 w-9 animate-spin text-secondary" />
                </div>
            )}
            {/* Show lock icon and message if the video is locked */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p>
                        This Chapter is Locked
                    </p>
                </div>
            )}
            {/* Show the video player if the video is not locked */}
            {!isLocked && (
                <MuxPlayer title={title} className={cn(
                    !isReady && "hidden"
                )}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onEnd}
                    autoPlay
                    playbackId={playbackId} />
            )}
        </div>
    )
}
