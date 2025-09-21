import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middleware use only when middleware is used before routes

app.use(cors({
    origin:process.env.FRONTEND_URL
}));



//express.json is used to parse json data
//limit is used to limit the size of data we can send
app.use(express.json({ limit: "50mb" }));




//to handle form data
//extended true means we can send nested objects
//limit is used to limit the size of data we can send
//
app.use(express.urlencoded({ limit: "50mb", extended: true }));


//express.static is used to serve static files like images css js
//by default it will look for index.html file in public folder
//if we have other file we can access it by /filename
app.use(express.static("public"));

app.use(cookieParser());
export { app };