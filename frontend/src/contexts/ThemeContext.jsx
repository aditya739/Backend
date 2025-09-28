import React from "react";

const ThemeContext = React.createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const initialDark = saved ? JSON.parse(saved) : false;
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    document.documentElement.classList.toggle("dark", isDark);
    console.log('Theme changed to:', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    console.log('Toggling theme from', isDark, 'to', !isDark);
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeContext);