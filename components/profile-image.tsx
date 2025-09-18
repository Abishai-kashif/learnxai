import NameImage from "./name-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function ProfileImage({ user }: IProps) {
  return (
        <Avatar>
            <AvatarImage src={"https://github.com/shadcn.png"} />
            <AvatarFallback>
            <NameImage name={user.name} />
            </AvatarFallback>
        </Avatar>
    );
}

interface IProps {
    user: {
        name: string
    }
}

export default ProfileImage;
