import * as React from "react"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const TOAST_DURATION_MS = 2500

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, action, ...props }) {
        const message = [title, description]
          .filter((part): part is string => typeof part === "string" && part.length > 0)
          .join(" ")
        const actionElement =
          action && React.isValidElement(action)
            ? React.cloneElement(action as React.ReactElement<{ className?: string }>, {
                className: cn(
                  (action.props as { className?: string }).className,
                  "border-white/30 bg-white/10 text-white hover:bg-white/20"
                ),
              })
            : action

        return (
          <Toast
            key={id}
            variant={variant}
            duration={TOAST_DURATION_MS}
            className={cn(
              "w-[min(466px,calc(100vw-28px))] min-h-0 max-h-[112px] flex-col items-center justify-center gap-0 rounded-[2px] border-0 bg-[rgba(12,12,12,0.68)] px-5 py-4 text-center text-white shadow-[0_8px_28px_rgba(0,0,0,0.2)] backdrop-blur-[1px]",
              "data-[state=open]:slide-in-from-bottom-3 data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:fade-out-0 motion-reduce:animate-none motion-reduce:transition-none"
            )}
            {...props}
          >
            <div className="flex w-full min-w-0 flex-col items-center text-center">
              {message && (
                <ToastTitle className="line-clamp-2 whitespace-normal break-words text-[16px] font-normal leading-[1.45] text-white">
                  {message}
                </ToastTitle>
              )}
              {actionElement && (
                <div className="mt-3 flex justify-end">
                  {actionElement}
                </div>
              )}
            </div>
          </Toast>
        )
      })}
      <ToastViewport className="top-1/2 w-[min(30rem,calc(100vw-1rem))] gap-3" />
    </ToastProvider>
  )
}
