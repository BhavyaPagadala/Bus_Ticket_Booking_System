import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Bus from '../models/Bus.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import {sampleStation} from '../utils/stations.js';

await mongoose.connect(process.env.MONGODB_URI);
const routes=[['Hyderabad','Vijayawada'],['Hyderabad','Bengaluru'],['Hyderabad','Chennai'],['Vijayawada','Visakhapatnam'],['Bengaluru','Chennai'],['Chennai','Hyderabad'],['Hyderabad','Mumbai'],['Hyderabad','Pune'],['Mumbai','Ahmedabad'],['Chennai','Coimbatore'],['Bengaluru','Mysuru'],['Bhopal','Indore'],['Hyderabad','Nagpur'],['Kolkata','Patna'],['Mumbai','Surat'],['Kochi','Thiruvananthapuram'],['Jaipur','Udaipur'],['Delhi','Agra'],['Delhi','Amritsar'],['Delhi','Lucknow'],['Hyderabad','Tirupati'],['Hyderabad','Anantapur'],['Hyderabad','Bhimavaram'],['Bhimavaram','Hyderabad'],['Bhimavaram','Vijayawada'],['Vijayawada','Bhimavaram'],['Bhimavaram','Visakhapatnam'],['Visakhapatnam','Bhimavaram'],['Bhimavaram','Bengaluru'],['Bengaluru','Bhimavaram'],['Bhimavaram','Chennai'],['Chennai','Bhimavaram'],['Bhimavaram','Mumbai'],['Mumbai','Bhimavaram'],['Bhimavaram','Delhi'],['Delhi','Bhimavaram'],['Bhimavaram','Pune'],['Pune','Bhimavaram'],['Hyderabad','Warangal'],['Hyderabad','Nizamabad'],['Hyderabad','Karimnagar'],['Hyderabad','Khammam'],['Hyderabad','Mahbubnagar'],['Hyderabad','Mancherial'],['Hyderabad','Suryapet'],['Vijayawada','Ongole'],['Vijayawada','Guntur'],['Vijayawada','Eluru'],['Vijayawada','Rajahmundry'],['Vijayawada','Kakinada'],['Vijayawada','Nellore'],['Vijayawada','Kurnool'],['Vijayawada','Kadapa'],['Vijayawada','Srikakulam'],['Vijayawada','Vizianagaram'],['Delhi','Chandigarh'],['Delhi','Dehradun'],['Delhi','Jammu'],['Delhi','Shimla'],['Bengaluru','Mangaluru'],['Mumbai','Thane']];
const istToday=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());
// Create one demo coach per configured route so every listed route has a bus
// on each of the five seeded dates.
for(let i=0;i<routes.length;i++){
  const total=32+(i%3)*4,cols=i%2?3:4,busType=i%2?'Premium Seater':'Standard Seater';
  const seatLayout=Array.from({length:total},(_,n)=>({seatId:`${String.fromCharCode(65+Math.floor(n/cols))}${n%cols+1}`,row:Math.floor(n/cols),column:n%cols,type:[2,6].includes(n)?'ladies':'standard'}));
  const bus=await Bus.findOneAndUpdate({busNumber:`DEMO-${100+i}`},{$set:{operatorName:`Demo Coach ${i+1}`,busType,totalSeats:total,seatLayout,amenities:['AC','USB charging','Reading light'],status:'active'}},{upsert:true,new:true,setDefaultsOnInsert:true});
  for(let d=1;d<=5;d++){
    const [source,destination]=routes[(i+d-1)%routes.length],date=new Date(`${istToday}T00:00:00+05:30`);
    date.setUTCDate(date.getUTCDate()+d);
    const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(date);
    const departureDateTime=new Date(`${day}T${String(6+(i%12)).padStart(2,'0')}:00:00+05:30`),arrivalDateTime=new Date(+departureDateTime+(5+(i%5))*3600000);
    await Trip.updateOne({busId:bus.id,source,destination,departureDateTime},{$set:{sourceStation:sampleStation(source,i),destinationStation:sampleStation(destination,i+1)},$setOnInsert:{busId:bus.id,source,destination,departureDateTime,arrivalDateTime,farePerSeat:550+i*130,status:'scheduled'}},{upsert:true});
  }
}
if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD){
  if(process.env.ADMIN_PASSWORD.length<12)throw new Error('Use an ADMIN_PASSWORD of at least 12 characters.');
  await User.updateOne({email:process.env.ADMIN_EMAIL.toLowerCase()},{$setOnInsert:{name:'Administrator',email:process.env.ADMIN_EMAIL,phone:'9999999999',password:await bcrypt.hash(process.env.ADMIN_PASSWORD,12),role:'admin'}},{upsert:true});
}
console.log('Demo data seeded; schedules are illustrative only.');
await mongoose.disconnect();
