import { useState } from "react";
import { Menu } from "../icons/Menu";
import { Search } from "../icons/Search";
import { DoubleArrowRight } from "../icons/DoubleArrowRight";
import { List } from "../icons/List";
import { Calendar } from "../icons/Calendar";
import { Settings } from "../icons/Settings";
import { SignOut } from "../icons/SignOut";
import { Input } from "./Input";
import { cn } from "../../lib/utils";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  activeSection?: "upcoming" | "today" | "calendar";
  onSectionChange?: (section: "upcoming" | "today" | "calendar") => void;
}

export function Sidebar({
  activeSection = "upcoming",
  onSectionChange,
}: SidebarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error("Errore durante il logout:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const menuItems = [
    {
      id: "upcoming" as const,
      label: "Upcoming",
      icon: DoubleArrowRight,
      badge: "15+",
    },
    {
      id: "today" as const,
      label: "Today",
      icon: List,
      badge: "8",
    },
    {
      id: "calendar" as const,
      label: "Calendar",
      icon: Calendar,
    },
  ];

  return (
    <div className="w-64 bg-white rounded-lg p-6 flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-black">Menu</h2>
        <button className="text-black hover:opacity-70">
          <Menu />
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Input placeholder="Search..." className="pl-10" />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
            <Search />
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-auto">
        <h3 className="text-sm font-semibold text-black mb-3">Tasks</h3>
        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "text-black hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-black"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition-colors">
          <Settings />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SignOut />
          <span className="text-sm font-medium">
            {isLoading ? "Logout in corso..." : "Sign Out"}
          </span>
        </button>
      </div>
    </div>
  );
}
