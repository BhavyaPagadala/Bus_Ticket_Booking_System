import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {AuthProvider} from './context/Auth';
import {ThemeProvider} from './context/Theme';
import Nav from './components/Nav';
import Protected from './components/Protected';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Search from './pages/Search';
import TripSeats from './pages/TripSeats';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';
import './styles.css';
export default function App(){return <BrowserRouter><ThemeProvider><AuthProvider><Nav/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<AuthPage/>}/><Route path="/register" element={<AuthPage register/>}/><Route path="/search" element={<Search/>}/><Route path="/trip/:id" element={<TripSeats/>}/><Route element={<Protected/>}><Route path="/bookings" element={<Bookings/>}/></Route><Route element={<Protected admin/>}><Route path="/admin" element={<Admin/>}/></Route><Route path="*" element={<main className="page"><h1>Page not found</h1></main>}/></Routes></AuthProvider></ThemeProvider></BrowserRouter>}
