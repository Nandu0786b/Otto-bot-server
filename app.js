import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";



// routes
import user from "./routes/userAuth.js";


// express app 
const app = express();
dotenv.config();
app.use(express.json()); 
app.use(helmet()); 
app.use(cookieParser()); // To handle jwt token from the cookie 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // To check speed in dev
app.use(morgan("dev"));    // ""
app.use(express.json({ limit: '1mb' })); //Limit on the json data from frontend to stay safe from crash and memory run out
app.use(express.urlencoded({ limit: '1mb', extended: true })); //Limit on the json data from frontend to stay safe from crash and memory run out
app.use(cors());
app.disable("x-powered-by");  //To hide backend stack from the hacker's


// routes
app.use("/v1/user", user); 





const PORT = process.env.port || 5000;
let server;
// Define the options for the database connection
const DB_OPTIONS = {
    dbName: 'ottoBot',        // Specify the database name
    maxPoolSize: 10,       // Set the maximum pool size
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  

mongoose.connect(process.env.mongourl,DB_OPTIONS)
  .then(() => {
    server = app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}\non Process Id : ${process.pid}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));


process.on('SIGTERM',()=>{
    //for the production
    console.log("SIGTERM recived");
    console.log("server is closed for the new user , but old user have time to complete their process");
    server.close(()=>{
        console.log("All ");
        mongoose.connection.close(false,()=>{
            process.exit(0);
        });//false for the gracefull close
        
    })
});
process.on('SIGINT',()=>{//this is for the devlopment
    console.log("SIGINT recived");
    console.log("server is closed for the new user , but old user have time to complete their process");
    server.close(()=>{
        console.log("All request is processed");
        mongoose.connection.close(false);//false for the gracefull close
        process.exit(0);
    })
    
});