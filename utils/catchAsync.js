// the wrapper function which will let us know if there's any error:
const catchAsync = (fn) => {
    return function(req, res, next){
        fn(req, res, next).catch(next);
    }
}

module.exports = catchAsync;