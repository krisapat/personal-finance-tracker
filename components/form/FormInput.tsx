import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";

type FormInputProps = {
    name: string;
    label: string;
    type: string;
    defaultValue?: string;
    placeholder?: string;
    className?: string;
}

const FormInput = (props: FormInputProps) => {
    const { name, label, type, defaultValue, placeholder, className } = props
    return (
        <div className={className}>
            <Label htmlFor={name}>{label}</Label>
            <Input
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder} 
            />
        </div>
    )
}
export default FormInput    