const errorHandler = (err, req, res, next) => {
    console.log(err);
    if(err.name === "ErrorNotFound"){
        res.status(404).json({name: "Error Not Found", message: err.message || "Not Found"})
    } else if (err.name === "InvalidCredentials") {
        res.status(400).json({name: "Invalid Credentials", message: err.message || "Something Went Wrong"})
    } else if (err.name === "Unauthenticated"){
        res.status(400).json({name: "Unauthenticated", message: err.message || "Please Login"})
    } else if (err.name === "Unauthorized"){
        res.status(403).json({name: "Unauthorized", message: err.message || "Forbidden"})
    } else if (err.name === "ProductRegistered") {
        res.status(400).json({name: "ProductRegistered", message: err.message || "Product Registered"})
    } else {
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = errorHandler