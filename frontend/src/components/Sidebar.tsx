import { useAuth } from "@/context/AuthContext";
import { useState, useMemo, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Shield,
  ShieldCheck,
  AlertTriangle,
  ClipboardCheck,
  Users,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navGroups = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Chat", url: "/chat", icon: MessageSquare },
    ],
  },
  {
    title: "GRC Management",
    items: [
      { title: "Risk Register", url: "/risks", icon: AlertTriangle },
      { title: "Compliance", url: "/compliance", icon: ClipboardCheck },
      { title: "Policy Management", url: "/policies", icon: ShieldCheck },
      { title: "Documents", url: "/documents", icon: FileText },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "User Management", url: "/users", icon: Users, adminOnly: true },
    ],
  },
];

const bottomNavItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: LifeBuoy },
];


interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [openAccordion, setOpenAccordion] = useState<string[]>([]);

  const filteredNavGroups = useMemo(() => {
    if (user?.role === 'admin') {
      return navGroups;
    }
    return navGroups.map(group => ({
      ...group,
      items: group.items.filter(item => !item.adminOnly)
    })).filter(group => group.items.length > 0);
  }, [user?.role]);

  useEffect(() => {
    const activeGroup = filteredNavGroups.find(group =>
      group.items.some(item => isActive(item.url))
    );
    if (activeGroup) {
      setOpenAccordion([activeGroup.title]);
    }
  }, [location.pathname, filteredNavGroups]);


  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }: { item: { title: string; url: string; icon: React.ElementType } }) => {
    const isCurrentlyActive = isActive(item.url);
    return (
      <li>
        <NavLink
          to={item.url}
          className={cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
            isCurrentlyActive
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <item.icon className={cn(
            "flex-shrink-0 w-5 h-5 transition-colors duration-200",
            isCurrentlyActive 
              ? "text-primary-foreground" 
              : "text-muted-foreground group-hover:text-foreground"
          )} />
          {!collapsed && (
            <span className="ml-3 truncate">{item.title}</span>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <aside className={cn(
      "relative bg-card border-r border-border transition-all duration-300 ease-in-out shadow-elegant flex flex-col h-screen",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-card shadow-md hover:shadow-lg transition-all"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Logo Section */}
      <div className="flex items-center px-6 py-6 border-b border-border flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-glow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground">GRC Assistant</h1>
              <p className="text-xs text-muted-foreground">for Safaricom PLC</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-grow overflow-y-auto">
        <nav className="mt-6 px-3">
          {collapsed ? (
            filteredNavGroups.map(group => (
              <div key={group.title} className="mb-4">
                <ul className="space-y-1">
                  {group.items.map((item) => <NavItem key={item.title} item={item} />)}
                </ul>
                <Separator className="my-4" />
              </div>
            ))
          ) : (
            <Accordion
              type="multiple"
              value={openAccordion}
              onValueChange={setOpenAccordion}
            >
              {filteredNavGroups.map((group) => (
                <AccordionItem value={group.title} key={group.title} className="border-none">
                  <AccordionTrigger className="px-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase hover:no-underline">
                    {group.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1">
                      {group.items.map((item) => <NavItem key={item.title} item={item} />)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0">
        <nav className="px-3 mb-4">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => <NavItem key={item.title} item={item} />)}
          </ul>
        </nav>

        {/* User Section */}
        {!collapsed && (
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-card rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || user?.email}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}