import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const userSchema = new Schema({

username: { type: String, required: true, unique: true,index:true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
createdAt: { type: Date, default: Date.now },
Fullname: { type: String,required:true },
avatar: { type: String,required:true },
watchHIstory: { type: Schema.types.ObjectId, ref: 'Video' },

password:{
    type:String,
    required:[true,"password is require"],
    
},
refreshToken:{type:String,default:""}






},{timestamps:true  });



//for encrypting the password
//using mongoose hooks
//pre save
//this keyword is used to access the current user
//isModified is a method of mongoose which check whether the password is modified or not
//if not modified then we will not hash it again
//if modified then we will hash it
//10 is the salt rounds
//next is a callback function which is called after the middleware is executed
//it is used to move to the next middleware

userSchema.pre('save',async function(next){
    //this keyword is used to access the current user
    if(!this.password.isModified("password"))return next();
      this.password = await bcrypt.hash(this.password,10);
      next();  
})
//for comparing the password
//designing a method
userSchema.methods.isPasswordCorrect = async function(password)
{
    //bcrypt library hash the password but also check compare the hashed password
   return await bcrypt.compare(password,this.password)
}


//for generating the jwt token
userSchema.methods.generateAccessToken = function(){
    //jwt.sign is used to generate the token
   return jwt.sign(
        {
            //payload is the data which we want to store in the token
            _id:this._id,
            username:this.username,
            email:this.email,
            fullName:this.fullName,
        },
        //access token secret key
        process.env.ACCESS_TOKEN_SECRET,{
            //expiry time of the token
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY

        }
    )
}


userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            //payload is the data which we want to store in the token
            _id:this._id,
            
        },
        //access token secret key
        process.env.REFRESH_TOKEN_SECRET,{
            //expiry time of the token
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY

        }
    )
}
    //jwt.sign is used to generate the token
    //payload is the data which we want to store in the token



export const User = mongoose.model('User', userSchema);

//for increasing the security of passwords we take help from mongoose hooks