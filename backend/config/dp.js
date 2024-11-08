import mongoose from "mongoose";

export const connectDB =async () =>{
    await mongoose.connect('mongodb+srv://amankheria09:dbKheria_6917@cluster0.4bfkm.mongodb.net/food-del').then(()=>console.log("DB connected"));
}