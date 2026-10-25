import mongoose from 'mongoose';
import Trip from '../models/Trip.js';
import Bus from '../models/Bus.js';
import {AppError} from '../utils/errors.js';
import {cities} from '../utils/cities.js';
import {stationsFor,sampleStation} from '../utils/stations.js';
const tripQuery=()=>Trip.find().populate('busId','operatorName busNumber busType totalSeats seatLayout amenities status');
export async function search(req,res){
  const {source,destination,date,sourceStation,destinationStation}=req.query;
  if(!cities.includes(source)||!cities.includes(destination)||source===destination)throw new AppError('Choose two different supported cities.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))throw new AppError('Journey date must use YYYY-MM-DD.');
  if(sourceStation&&!stationsFor(source).includes(sourceStation))throw new AppError('Choose a valid boarding station for this city.');
  if(destinationStation&&!stationsFor(destination).includes(destinationStation))throw new AppError('Choose a valid arrival station for this city.');
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());
  if(date<today)throw new AppError('Past journey dates are not bookable.');
  const start=new Date(date+'T00:00:00+05:30'),end=new Date(start.getTime()+86400000);
  const filter={source,destination,status:'scheduled',departureDateTime:{$gte:start,$lt:end,$gt:new Date()}};
  if(sourceStation)filter.sourceStation=sourceStation;
  if(destinationStation)filter.destinationStation=destinationStation;
  const trips=await tripQuery().find(filter).sort({departureDateTime:1});
  res.json({trips:trips.map(t=>{const doc=t.toObject();delete doc.seatHolds;delete doc.bookedSeats;return {...doc,availableSeats:Math.max(0,t.busId.totalSeats-t.bookedSeats.length-t.seatHolds.filter(h=>h.expiresAt>new Date()).reduce((n,h)=>n+h.seats.length,0))}})});
}
export async function listCities(req,res){res.json({cities});}
export async function listStations(req,res){
  const {city}=req.query;
  if(!cities.includes(city))throw new AppError('Choose a supported city.');
  res.json({city,stations:stationsFor(city)});
}
export async function seatMap(req,res){
  if(!mongoose.isValidObjectId(req.params.id))throw new AppError('Invalid trip ID.');
  const trip=await tripQuery().findById(req.params.id);
  if(!trip)throw new AppError('Trip not found.',404);
  const now=new Date(),holds=trip.seatHolds.filter(h=>h.expiresAt>now);
  res.json({trip:{id:trip.id,source:trip.source,sourceStation:trip.sourceStation,destination:trip.destination,destinationStation:trip.destinationStation,departureDateTime:trip.departureDateTime,arrivalDateTime:trip.arrivalDateTime,farePerSeat:trip.farePerSeat,status:trip.status,busId:trip.busId},seatStatus:trip.busId.seatLayout.map(s=>({...s.toObject(),status:trip.bookedSeats.includes(s.seatId)?'booked':holds.some(h=>h.seats.includes(s.seatId))?'held':'available'}))});
}
export async function createTrip(req,res){
  const {busId,source,destination,departureDateTime,arrivalDateTime,farePerSeat}=req.body;
  const sourceStation=req.body.sourceStation||sampleStation(source),destinationStation=req.body.destinationStation||sampleStation(destination);
  if(!mongoose.isValidObjectId(busId)||!cities.includes(source)||!cities.includes(destination)||source===destination)throw new AppError('Select a valid bus and distinct supported cities.');
  if(!stationsFor(source).includes(sourceStation)||!stationsFor(destination).includes(destinationStation))throw new AppError('Choose valid stations for the selected cities.');
  const dep=new Date(departureDateTime),arr=new Date(arrivalDateTime);
  if(Number.isNaN(+dep)||Number.isNaN(+arr)||dep<=new Date()||arr<=dep||!Number.isFinite(+farePerSeat)||farePerSeat<0)throw new AppError('Provide a future departure, later arrival, and nonnegative fare.');
  const bus=await Bus.findById(busId);
  if(!bus||bus.status!=='active')throw new AppError('The selected bus is unavailable.');
  const collision=await Trip.exists({busId,status:{$ne:'cancelled'},departureDateTime:{$lt:arr},arrivalDateTime:{$gt:dep}});
  if(collision)throw new AppError('This bus has an overlapping trip.');
  const trip=await Trip.create({busId,source,sourceStation,destination,destinationStation,departureDateTime:dep,arrivalDateTime:arr,farePerSeat});
  res.status(201).json({trip});
}
export async function adminTrips(req,res){res.json({trips:await tripQuery().sort({departureDateTime:1})});}
export async function updateTrip(req,res){
  const trip=await Trip.findById(req.params.id);
  if(!trip)throw new AppError('Trip not found.',404);
  if(trip.bookedSeats.length||trip.seatHolds.some(h=>h.expiresAt>Date.now()))throw new AppError('Trips with bookings or active holds cannot be edited.');
  if(req.body.sourceStation!==undefined){if(!stationsFor(trip.source).includes(req.body.sourceStation))throw new AppError('Choose a valid boarding station.');trip.sourceStation=req.body.sourceStation;}
  if(req.body.destinationStation!==undefined){if(!stationsFor(trip.destination).includes(req.body.destinationStation))throw new AppError('Choose a valid arrival station.');trip.destinationStation=req.body.destinationStation;}
  for(const k of ['farePerSeat','status'])if(req.body[k]!==undefined)trip[k]=req.body[k];
  await trip.save();res.json({trip});
}
