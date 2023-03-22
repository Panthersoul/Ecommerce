import {model, Schema} from "mongoose";

const userSchema = Schema({
    username: { type: String },
    password: { type: String },
    firstname: { type: String },
    address: { type: String },
    age: { type: Number },
    telephone: { type: String},    
    picture: { type: String }
})

export const User = model("user", userSchema);