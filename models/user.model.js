import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "User Name is required"], 
        trim: true,
        minLenght: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "User Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
        minLength: 5,
        maxLength: 255,
    }, password: {
        type: String,
        required: [true, "User Password is required"],
        minLength: 6
    },
   
},  {timestamps: true} );


const User = mongoose.model('User' //name
 ,userSchema);

export default User;