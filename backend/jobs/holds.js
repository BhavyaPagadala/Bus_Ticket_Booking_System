import Trip from '../models/Trip.js';
export function startHoldCleanup(){setInterval(()=>Trip.updateMany({'seatHolds.expiresAt':{$lte:new Date()}},{$pull:{seatHolds:{expiresAt:{$lte:new Date()}}}}).catch(err=>console.error('Hold cleanup failed:',err.message)),60_000).unref();}
