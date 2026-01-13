import { Button } from "@/components/ui/button";
import { Sparkles, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/leads")}>
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">MyEstatia</span>
        </div>

        <nav className="flex gap-1 ml-6">
          <Button
            variant={location.pathname.startsWith("/leads") ? "secondary" : "ghost"}
            onClick={() => navigate("/leads")}
            className="text-sm"
          >
            Leads
          </Button>
          <Button
            variant={location.pathname === "/properties" ? "secondary" : "ghost"}
            onClick={() => navigate("/properties")}
            className="text-sm"
          >
            Properties
          </Button>
          <Button
            variant={location.pathname === "/integrations" ? "secondary" : "ghost"}
            onClick={() => navigate("/integrations")}
            className="text-sm"
          >
            Integrations
          </Button>
        </nav>

        <div className="flex-1" />

        <Button
          className="bg-gradient-primary hover:opacity-90 shadow-ai"
          onClick={() => navigate("/ai-actions")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          AI Actions
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/my-account")}>
              <User className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
