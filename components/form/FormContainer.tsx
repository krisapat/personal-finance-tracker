'use client'
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import type { FormState } from "@/actions/actions"

const initialState: FormState = { message: "", success: undefined }

type FormContainerProps = {
  children: React.ReactNode
  action: (prevState: FormState, formData: FormData) => Promise<FormState>
  className?: string
  successMessage?: string
  failureMessage?: string
}

export default function FormContainer({
  children,
  action,
  className,
  successMessage = "Action succeeded",
  failureMessage = "Action failed",
}: FormContainerProps) {
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success === true) {
      toast(successMessage, { description: state.message })
    } else if (state.success === false) {
      toast(failureMessage, { description: state.message })
    }
  }, [state, successMessage, failureMessage])

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  )
}