import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"
const router = Router();

// route: POST /api/users/register

//this is for middle ware if images is uploded the is going to  take images
router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1

    }]),
    registerUser);

export default router;
