const errorHandler = (err, req, res, next) => {
    console.log(err);
    if(err.name === "ErrorNotFound"){
        res.status(404).json({name: "Error Not Found", message: err.message || "Not Found"})
    } else if (err.name === "InvalidCredentials") {
        res.status(400).json({name: "Invalid Credentials", message: err.message || "Something Went Wrong"})
    } else if (err.name === "Unauthenticated"){
        res.status(400).json({name: "Unauthenticated", message: err.message || "Please Login"})
    } else if (err.name === "StockInsufficient") {
        res.status(400).json({ message: "Stock Not Enough" });
    } else if (err.name === "InvalidPrice") {
        res.status(400).json({ message: "Wrong Price" });
    } else if (err.name === "Unauthorized"){
        res.status(403).json({name: "Unauthorized", message: err.message || "Forbidden"})
    } else if (err.code === "P2002") {
        res.status(400).json({name: "UniqueConstraintError", message: err.message || "UniqueConstraint Error"})
    } else if (err.name === "PrismaClientValidationError") {
        res.status(400).json({name: "PrismaClientValidationError", message: err.message || "PrismaClientValidationError Error"})
    } else {
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = errorHandler