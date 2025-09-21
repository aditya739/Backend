// for using import in dotenv  we use config
//otherwise it will not work,if  dont wont to use this we can  usre require
// const dotenv = require("dotenv");
// dotenv.config({path: "./.env"});

import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import mongoose from "mongoose";
import{ DB_NAME} from "./constants.js";

import connectDb from "./db/index.js";
const app = express();

connectDb()
.then(() => {

    //this will run only when db is connected
    //and on  port we can run our server
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
})
.catch((error) => {
    console.error("ERROR:", error);
    throw error;
});















/*
//USING IFI FOR ASYNC AWAIT
(async () => {
    try{

        await mongoose.connect('${process.env.MONGODB_URL}/${DB_NAME}');
        app.on("error",(error)=>{
            console.log("ERROR:",error);
        })
}

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port",process.env.PORT);
})
catch(error){
    console.error("ERROR:", error);
    throw error;
}
}
)()
*/
