class ApiError extends Error {

//extends the built in error class
//to create a custom error class
//that can be used to throw errors with
//custom status code and message
//and also to handle errors in a better way in express
//by sending json response with error message and status code
//and also to log the error stack trace
//it takes status code and message as arguments
//and also an optional array of errors and stack trace
//if stack trace is not provided it will capture the stack trace
//using Error.captureStackTrace method
//it also sets success to false and errors to the provided error array

    constructor(
        statusCode,
        message="Somthing went wrong",
        error =[],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.stack = stack;
        this.message = message;
        this.success = false;
        this.errors = error;


        //if stack is provided use it otherwise capture the stack trace
        //THIS IF ELSE IS USED TO AVOID UNDEFINED STACK TRACE
        //WHICH CAN HAPPEN IF WE DONT PASS STACK TRACE
        //IF STACK IS PROVIDED USE IT OTHERWISE CAPTURE THE STACK TRACE
        //
   if(stack){
    this.stack = stack;
    } else{Error.captureStackTrace(this, this.constructor);
   }




    }
}
export { ApiError };
