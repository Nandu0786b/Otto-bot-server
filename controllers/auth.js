import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import FCM from "fcm-node";



export const register = async (req, res)=>{
    try {
        try{
        const {name, email, pass} = req.body;
        console.log(name, email, pass)
        if (!name || !email || !pass) {
        return res.status(400).json({
             stat:"OK",
             error: "Missing data",
             Verified:false,
             message:"Access Denied, Please send all data" });
        }
        const salt = await bcrypt.genSalt();
        const passwordhash = await bcrypt.hash(pass, salt);
        const newUser = new userModel({email:email, pass:passwordhash, name:name});
        await newUser.save();
        return res.status(201).json({
            stat:"OK",
            Error:"",
            Verified:false,
            message:"Created"})
        }
        catch (error) {
            console.log(error.message)
            return res.status(403).json({
                stat:"OK",
                Error:error.message,
                Verified:false,
                message:"Not able to register new admin"})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            stat:OK,
            Error:error.message,
            Verified:false,
            message:"Internal Server Problem"})
    }
}

