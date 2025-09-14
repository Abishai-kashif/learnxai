import { ThemeToggle } from "@/components/theme-toggle"
import { FaBrain } from "react-icons/fa";


export function Header() {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
          <FaBrain />
        </div>
        <span className="font-semibold text-lg text-foreground">learnXai</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-muted-foreground font-medium">SC</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Sarah Chen</h3>
            <p className="text-xs text-muted-foreground">Premium Member</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
