// A simple wrapper to handle async route functions
// A simple wrapper to handle async route functions
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};



//function to handle async errors
//it takes a function as an argument

//and returns a function that takes req,res,next as arguments
//it calls the function and catches any error
//if error occurs it sends a json response with error message
//this is using try and catch
// const asyncHandler = (fn) => (req, res, next) => {
// try{
//  await fn(req, res, next);
// }
// catch(error){
//     res.status(500).json({
//         success:false,
//         message:error.message
//     });
// }



//}