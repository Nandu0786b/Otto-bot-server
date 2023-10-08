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


export const login = async (req, res)=>{
    try {
        const {email, pass} = req.body;
        if(!email || !pass){
            return res.status(400).json({ "stat":"OK","error": "Missing data","Verified":false,"message":"Access Denied, Please send all data" });
        }
        const user = await userModel.findOne({email:email});
        if(!user){
            return res.status(400).json({ "stat":"OK","error": "user not exist","Verified":false,"message":"Access Denied, Please Login again" });
        }
        const ismatch = await bcrypt.compare(pass,user.pass);
        if(!ismatch){
            return res.status(400).json({"stat":"OK","Error":"","Verified":false,"message":"Access Denied, Please Login again"})
        }
        const currentDate = new Date();
        const sevenDaysLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Calculate the date 7 days from now

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Specify the expiration in 7 days
        });

        res.cookie('jwt', token, {
        expires: sevenDaysLater, // Set the cookie expiration time
        httpOnly: true,
        });

        return res.status(201).json({"stat":"OK","Error":"","Verified":true,"message":"token generated","profile":{id:user._id, name:user.name, email:user.email, token:token}})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({"stat":"OK","Error":error.message,"Verified":false,"message":"Internal Server Problem"})
    }
}

export const profile = async(req,res)=>{
    try {
        const id = req._id;
        if(!id){
            return res.status(400).json({ "stat":"OK","error": "Missing data","Verified":false,"message":"Access Denied, Please send all data" });
            //if this happen then we can remove available jwt token from the cookies
        }
        const user = await userModel.findById(id,{pass:0})
        if(!user){
            return res.status(400).json({ "stat":"OK","error": "user not exist","Verified":false,"message":"Access Denied, Please try again" });
        }
        return res.status(201).json({"stat":"OK","Error":"","Verified":true,"message":"user found success","profile":{id:user._id, name:user.name, email:user.email, pushEnable:user.pushEnable}})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({"stat":"OK","Error":error.message,"Verified":true,"message":"Try again"})
    }
}


