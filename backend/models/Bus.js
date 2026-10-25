import mongoose from 'mongoose';
const seatSchema=new mongoose.Schema({seatId:{type:String,required:true},row:{type:Number,required:true},column:{type:Number,required:true},type:{type:String,enum:['standard','ladies'],default:'standard'}},{_id:false});
const schema=new mongoose.Schema({operatorName:{type:String,required:true,trim:true},busNumber:{type:String,required:true,unique:true,uppercase:true,trim:true},busType:{type:String,enum:['Standard Seater','Premium Seater'],required:true},totalSeats:{type:Number,required:true,min:1},seatLayout:{type:[seatSchema],validate:v=>v.length>0},amenities:[String],status:{type:String,enum:['active','inactive'],default:'active'}},{timestamps:true});
export default mongoose.model('Bus',schema);
