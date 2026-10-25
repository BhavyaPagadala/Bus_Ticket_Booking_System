import {Link,useNavigate} from 'react-router-dom';
import {BusFront,LogOut,Moon,Sun} from 'lucide-react';
import {useAuth} from '../context/Auth';
import {useTheme} from '../context/Theme';
export default function Nav(){
  const {user,logout}=useAuth(),nav=useNavigate(),{theme,toggleTheme}=useTheme();
  return <header className="nav"><Link className="brand" to="/"><span className="brand-icon"><BusFront size={21}/></span> wayfarer<span className="brand-dot">.</span></Link><nav><Link to="/">Explore</Link>{user&&<Link to="/bookings">My bookings</Link>}{user?.role==='admin'&&<Link to="/admin">Admin</Link>}<button className="nav-action theme-toggle" onClick={toggleTheme} aria-label={theme==='light'?'Switch to dark theme':'Switch to light theme'} title={theme==='light'?'Switch to dark theme':'Switch to light theme'}>{theme==='light'?<Moon size={17}/>:<Sun size={17}/>}<span>{theme==='light'?'Dark':'Light'} mode</span></button>{user?<button className="nav-action" onClick={()=>{logout();nav('/')}}><LogOut size={16}/> Sign out</button>:<><Link to="/login">Log in</Link><Link className="button small" to="/register">Create account</Link></>}</nav></header>
}
