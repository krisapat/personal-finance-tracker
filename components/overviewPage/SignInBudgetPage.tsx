import FormInput from "../form/FormInput"
import { SignInBudgetButton } from "../form/SubmitButtons"

const SignInBudgetPage = () => {
  return (
    <section className="flex justify-center">
        <div className="border p-4 w-full max-w-2xl rounded-md shadow-md">
          <div className="flex flex-col max-w-lg mx-auto" >
            <div className="flex flex-col gap-2 mb-2">
              <FormInput
                name="amount"
                label="ตั้งงบใช้เงินใน 1 วัน (บาท)"
                type="number"
                placeholder="Enter your first name"
                className="space-y-2 w-full"
              />
            </div>
            <SignInBudgetButton />
          </div>
        </div>
      </section>
  )
}
export default SignInBudgetPage