'use client'
import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs";
import { Heart, LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonsProps = {
  type: "submit"
  size?: "sm" | "lg" | "default" | "icon" | null | undefined
  text: string;
  className?: string
}

const SubmitButtons = (props: SubmitButtonsProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type={props.type} size={props.size} className={props.className} disabled={pending}>
      {
        pending ? <div>
          <LoaderCircle className="animate-spin inline-block mr-2" />
          <span>Loading...</span>
        </div>
          : props.text
      }
    </Button>
  )
}
export default SubmitButtons

export const SignInBudgetButton = () => {
  return (
    <SignInButton mode="modal">
      <Button
        size={"lg"}
        className="my-4 text-white shadow-md hover:scale-102 transition-transform duration-300">
        บันทึก!
      </Button>
    </SignInButton>
  )
}

export const CardSubmitButton = ({ isFavorite, disabled }: { isFavorite: boolean, disabled?: boolean }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      className=" text-red-500 bg-transparent
                  transition-colors hover:text-red-500! hover:bg-transparent! border-0"
      disabled={pending || disabled}
    >
      {pending ? <LoaderCircle className="animate-spin" /> : isFavorite ? <Heart className="fill-red-500" /> : <Heart />}
    </Button>
  )
}

export const CardDeleteButton = ({ disabled }: { disabled?: boolean }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="icon"
      className="shadow-lg bg-red-500 text-white transition-colors hover:bg-red-500"
      disabled={pending || disabled}
    >
      {pending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <Trash2 />
      )}
    </Button>
  )
}