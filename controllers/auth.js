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



// Below is the for user firbase token which will be handle from the frontend, during the last time
export const token = async (req, res) => {
  try {
    // instead of direct token update, first save the token and create new variable called verified and run a service which will identify the user which registered in the last 5 minute and 
    // and still token is not verified just send request to them and if success response from firebase then set verified true else delete the token
    var fcm = new FCM(process.env.serverKey);
    const id = req._id;
    const token = req.body.token;
    
    if (!id || !token) {
      return res.status(400).json({
        "stat": "OK",
        "error": "Missing data",
        "Verified": true,
        "message": "Access Denied, Please send all data"
      });
    }

    // Find the user by ID and update the token and pushEnable
    const user = await userModel.findByIdAndUpdate(
      id,
      { pushToken:token, pushEnable: true },
      { new: true } // To get the updated user object
    );

    if (!user) {
      return res.status(400).json({
        "stat": "OK",
        "error": "User not exist",
        "Verified": false,
        "message": "Access Denied, Please try again"
      });
    }

    var message = {
        to:token,
            notification: {
                title: `Hi, ${user.name} this is Test Alert`,
                body: 'India becomes a $10 trillion economy.',
            },
    
            data: { //you can send only notification or only data(or include both)
                title: 'test',
                body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
            }
    
        };
    
        fcm.send(message, function(err, response) {
            if (err) {
                console.log("Something has gone wrong!"+err);
                console.log("Respponse:! "+response);
            } else {
                // showToast("Successfully sent with response");
                console.log("Successfully sent with response: ", response);
            }
    
        });

    return res.status(201).json({
      "stat": "OK",
      "Error": "",
      "Verified": true,
      "message": "Subscribed",
      "profile": {
        id: user._id,
        name: user.name,
        email: user.email,
        pushEnable: user.pushEnable
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      "stat": "OK",
      "Error": error.message,
      "Verified": true,
      "message": "Try again"
    });
  }
};
