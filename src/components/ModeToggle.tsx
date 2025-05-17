
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = isDark ? "dark" : "light";
    
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
