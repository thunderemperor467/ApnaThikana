// ASYNC WRAP FUNCTION for async error handling
module.exports = (fn) =>{
    return(req, res, next) =>{
        fn(req, res, next).catch(next);
    }
}