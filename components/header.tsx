import { ThemeToggle } from "@/components/theme-toggle"
import { FaBrain } from "react-icons/fa";
import ProfileImage from "./profile-image";

export function Header({ user }: IProps) {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
          <FaBrain />
        </div>
        <span className="font-semibold text-lg text-foreground">learnXai</span>
      </div>

      <div className="flex items-center gap-3">
        {user && 
        <div className="flex items-center gap-3">
            <ProfileImage user={user} />
          <div>
              <h3 className="font-semibold text-sm text-foreground">{user.name}</h3>
            <p className="text-xs text-muted-foreground">Premium Member</p>
          </div>
        </div>
        }
        <ThemeToggle />
      </div>
    </header>
  )
}

interface IProps {
  user: {
    name: string
    email: string
    id: string
  } | null
}