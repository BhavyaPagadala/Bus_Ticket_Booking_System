import {createContext,useContext,useEffect,useState} from 'react';
const ThemeContext=createContext(null);
export function ThemeProvider({children}){
  const [theme,setTheme]=useState(()=>localStorage.getItem('wayfarer-theme')||'light');
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('wayfarer-theme',theme)},[theme]);
  const toggleTheme=()=>setTheme(current=>current==='light'?'dark':'light');
  return <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
