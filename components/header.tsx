import { ThemeToggle } from "@/components/theme-toggle"
import ProfileImage from "./profile-image";
import Image from "next/image";

export function Header({ user }: IProps) {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="rounded-lg flex items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
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