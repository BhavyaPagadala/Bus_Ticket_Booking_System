import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowRight,ShieldCheck,Clock3,Armchair} from 'lucide-react';
import api from '../services/api';
export default function Home(){
  const [cities,setCities]=useState([]);
  const [source,setSource]=useState('Hyderabad');
  const [destination,setDestination]=useState('Vijayawada');
  const [sourceStations,setSourceStations]=useState([]);
  const [destinationStations,setDestinationStations]=useState([]);
  const [sourceStation,setSourceStation]=useState('');
  const [destinationStation,setDestinationStation]=useState('');
  const [date,setDate]=useState('');
  const [searchError,setSearchError]=useState('');
  const nav=useNavigate();
  useEffect(()=>{
    api.get('/cities').then(x=>setCities(x.cities)).catch(()=>setSearchError('Could not load supported cities. Check that the API is running.'));
    const firstSampleDate=new Date();firstSampleDate.setDate(firstSampleDate.getDate()+1);
    setDate(firstSampleDate.toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));
  },[]);
  useEffect(()=>{
    if(!cities.includes(source)){setSourceStations([]);setSourceStation('');return}
    let active=true;
    api.get('/stations',{params:{city:source}}).then(r=>{if(active){setSourceStations(r.stations);setSourceStation(current=>r.stations.includes(current)?current:r.stations[0]||'')}}).catch(e=>{if(active)setSearchError(e.message)});
    return ()=>{active=false}
  },[cities,source]);
  useEffect(()=>{
    if(!cities.includes(destination)){setDestinationStations([]);setDestinationStation('');return}
    let active=true;
    api.get('/stations',{params:{city:destination}}).then(r=>{if(active){setDestinationStations(r.stations);setDestinationStation(current=>r.stations.includes(current)?current:r.stations[0]||'')}}).catch(e=>{if(active)setSearchError(e.message)});
    return ()=>{active=false}
  },[cities,destination]);
  function search(e){
    e.preventDefault();setSearchError('');
    if(!cities.includes(source)||!cities.includes(destination)){setSearchError('Choose a city from the suggestions.');return}
    if(source===destination){setSearchError('Choose different origin and destination cities.');return}
    if(!sourceStation||!destinationStation){setSearchError('Choose a boarding and arrival station.');return}
    nav('/search?source='+encodeURIComponent(source)+'&sourceStation='+encodeURIComponent(sourceStation)+'&destination='+encodeURIComponent(destination)+'&destinationStation='+encodeURIComponent(destinationStation)+'&date='+date);
  }
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">YOUR JOURNEY, MADE SIMPLE</span><h1>Travel smarter.<br/><em>Book easier.</em></h1><p>Find a seat, settle in, and let the miles unfold. Your next great journey starts here.</p><div className="hero-note"><span><ShieldCheck size={17}/> Secure booking</span><span><Clock3 size={17}/> Quick checkout</span></div></div>
      <div className="search-card"><h2>Where are you headed?</h2><p>Find your next bus in a few clicks.</p><form onSubmit={search}>
        <label>From city<input list="supported-cities" value={source} onChange={e=>setSource(e.target.value)} placeholder="Type or choose a city" autoComplete="off" required/></label>
        <label>Boarding station<select value={sourceStation} onChange={e=>setSourceStation(e.target.value)} required><option value="">Choose station</option>{sourceStations.map(station=><option key={station}>{station}</option>)}</select></label>
        <button type="button" className="swap" onClick={()=>{setSource(destination);setDestination(source);setSourceStation(destinationStation);setDestinationStation(sourceStation)}} aria-label="Swap origin and destination">↕</button>
        <label>To city<input list="supported-cities" value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Type or choose a city" autoComplete="off" required/></label>
        <label>Arrival station<select value={destinationStation} onChange={e=>setDestinationStation(e.target.value)} required><option value="">Choose station</option>{destinationStations.map(station=><option key={station}>{station}</option>)}</select></label>
        <datalist id="supported-cities">{cities.map(city=><option key={city} value={city}/>)}</datalist>
        <label>Journey date<input type="date" min={new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'})} value={date} onChange={e=>setDate(e.target.value)} required/></label>
        {searchError&&<div className="error-box" role="alert">{searchError}</div>}
        <button className="button full">Search buses <ArrowRight size={17}/></button></form><small>Sample stations and schedules are for demonstration only.</small></div>
      <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
    </section>
    <section className="content-section"><div className="section-heading"><span className="eyebrow">THE WAYFARER DIFFERENCE</span><h2>A better way to get there.</h2></div><div className="feature-grid"><article><span className="feature-icon"><Armchair/></span><h3>Find your seat</h3><p>See seat availability before you book, with clear prices and journey details.</p></article><article><span className="feature-icon"><ShieldCheck/></span><h3>Book with confidence</h3><p>Your seats are held while you enter passenger details and confirm your trip.</p></article><article><span className="feature-icon"><Clock3/></span><h3>Plans can change</h3><p>Manage your tickets and review cancellation eligibility in one place.</p></article></div></section>
    <footer><b>wayfarer.</b><span>Illustrative student project schedules · Hyderabad, India</span><a href="mailto:hello@wayfarer.example">Contact</a></footer>
  </>
}
