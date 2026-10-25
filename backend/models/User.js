import mongoose from 'mongoose';
const schema = new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:100},email:{type:String,required:true,unique:true,lowercase:true,trim:true},phone:{type:String,required:true,trim:true},password:{type:String,required:true,select:false},role:{type:String,enum:['passenger','admin'],default:'passenger'}},{timestamps:true});
export default mongoose.model('User',schema);
