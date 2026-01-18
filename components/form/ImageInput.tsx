import { Label } from "../ui/label"
import { Input } from "../ui/input"

const ImageInput = ({className}:{className:string}) => {
    const name = "image"
    return (
        <div className={className}>
            <Label htmlFor={name} className="capitalize">{name}</Label>
            <Input
                id={name}
                name={name}
                type="file"
                required
                accept="image/*"
            />
        </div>
    )
}
export default ImageInput