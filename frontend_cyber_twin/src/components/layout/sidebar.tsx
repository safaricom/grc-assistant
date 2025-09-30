import { useState } from "react"
import { 
  LayoutDashboard, 
  GitBranch, 
  Shield, 
  Database, 
  AlertTriangle, 
  Activity,
  Users,
  CreditCard,
  Building,
  Headphones,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

const navigationItems = [
  { title: "Executive Overview", href: "/", icon: LayoutDashboard },
  { title: "Organizational Chart", href: "/org-chart", icon: GitBranch },
  { title: "Division Security", href: "/division-security", icon: Shield },
  { title: "Data Centers", href: "/data-centers", icon: Database },
  { title: "Attack Scenarios", href: "/attack-scenarios", icon: AlertTriangle },
  { title: "Live Monitoring", href: "/live-monitoring", icon: Activity },
]

const quickAccessItems = [
  { title: "Financial Services", count: "3,500 employees", icon: CreditCard, href: "/financial-services" },
  { title: "Technology", count: "2,800 employees", icon: Building, href: "/technology" },
  { title: "Commercial", count: "4,200 employees", icon: Users, href: "/division-security" },
  { title: "Finance", count: "850 employees", icon: Briefcase, href: "/division-security" },
  { title: "Human Resources", count: "420 employees", icon: Headphones, href: "/division-security" },
  { title: "Government & Regulatory", count: "180 employees", icon: GraduationCap, href: "/division-security" },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(true)

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/40 bg-card">
      {/* Menu Header */}
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          MENU
        </h2>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Quick Access Section */}
      <div className="mt-6 px-3">
        <button
          onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
          className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
        >
          QUICK ACCESS
          {isQuickAccessOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
        
        {isQuickAccessOpen && (
          <div className="mt-2 space-y-1">
            {quickAccessItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.href)}
                className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.count}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* General Section */}
      <div className="mt-6 px-3 pb-4">
        <h3 className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          GENERAL
        </h3>
        <div className="space-y-1">
          <NavLink to="/settings" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <span>Settings</span>
          </NavLink>
          <NavLink to="/help" className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <span>Help</span>
          </NavLink>
          <button onClick={() => navigate("/login")} className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}