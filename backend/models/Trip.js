import mongoose from 'mongoose';
const holdSchema=new mongoose.Schema({holdId:{type:String,required:true},userId:{type:mongoose.Schema.Types.ObjectId,required:true},seats:[String],expiresAt:{type:Date,required:true}},{_id:false});
const schema=new mongoose.Schema({
  busId:{type:mongoose.Schema.Types.ObjectId,ref:'Bus',required:true},
  source:{type:String,required:true,trim:true},
  sourceStation:{type:String,required:true,trim:true},
  destination:{type:String,required:true,trim:true},
  destinationStation:{type:String,required:true,trim:true},
  departureDateTime:{type:Date,required:true},
  arrivalDateTime:{type:Date,required:true},
  farePerSeat:{type:Number,required:true,min:0},
  bookedSeats:{type:[String],default:[]},
  seatHolds:{type:[holdSchema],default:[]},
  status:{type:String,enum:['scheduled','departed','completed','cancelled'],default:'scheduled'}
},{timestamps:true});
schema.index({busId:1,source:1,destination:1,departureDateTime:1},{unique:true});
schema.index({source:1,sourceStation:1,destination:1,destinationStation:1,departureDateTime:1,status:1});
export default mongoose.model('Trip',schema);
