import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Eye, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <Eye className="h-6 w-6" />
          <span>RetinaAI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          {user && (
            <>
              <Link to="/analyze" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Analyze</Link>
              <Link to="/history" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">History</Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">Login</Link></Button>
              <Button size="sm" asChild><Link to="/register">Register</Link></Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Home</Link>
            {user && (
              <>
                <Link to="/analyze" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Analyze</Link>
                <Link to="/history" onClick={() => setMobileOpen(false)} className="text-sm font-medium">History</Link>
              </>
            )}
            {user ? (
              <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild><Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link></Button>
                <Button size="sm" asChild><Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link></Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
