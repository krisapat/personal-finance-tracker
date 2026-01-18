"use client"

import { createBudgetAction } from "@/actions/actions"
import FormContainer from "../form/FormContainer"
import FormInput from "../form/FormInput"
import SubmitButtons from "../form/SubmitButtons"
import { usePathname } from "next/navigation"

const CreateBudgetForm = () => {
    const pathname = usePathname()
    return (
        <FormContainer
            action={createBudgetAction}
            className="flex flex-col max-w-lg mx-auto"
            successMessage="ตั้งงบสำเร็จ"
            failureMessage="ตั้งงบล้มเหลว"
        >
            <div className="flex flex-col gap-2 mb-2">
                <FormInput
                    name="amount"
                    label="ตั้งงบใช้เงินใน 1 วัน (บาท)"
                    type="number"
                    placeholder="Enter your budget"
                    className="space-y-2 w-full"
                />
                <input type="hidden" name="pathname" value={pathname} />
            </div>
            <SubmitButtons
                type="submit"
                size="lg"
                text="บันทึก!"
                className="my-4 text-white shadow-md hover:scale-102 transition-transform duration-300"
            />
        </FormContainer>
    )
}
export default CreateBudgetForm