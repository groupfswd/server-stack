const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === "ErrorNotFound") {
    res
      .status(404)
      .json({ name: "Error Not Found", message: err.message || "Not Found" });
  } else if (err.name === "InvalidCredentials") {
    res.status(400).json({
      name: "Invalid Credentials",
      message: err.message || "Something Went Wrong",
    });
  } else if (err.name === "Unauthenticated") {
    res.status(400).json({
      name: "Unauthenticated",
      message: err.message || "Please Login",
    });
  } else if (err.name === "Unauthorized") {
    res
      .status(403)
      .json({ name: "Unauthorized", message: err.message || "Forbidden" });
  } else if (err.code === "P2002") {
    res.status(400).json({
      name: "UniqueConstraintError",
      message: err.message || "UniqueConstraint Error",
    });
  } else if (err.name === "PrismaClientValidationError") {
    res.status(400).json({
      name: "PrismaClientValidationError",
      message: err.message || "PrismaClientValidationError Error",
    });
  } else if (err.name === "InvalidSort") {
    res.status(400).json({ name: "Sort Invalid" });
  } else if (err.name === "InsufficientStock") {
    res.status(400).json({
      name: "InsufficientStock",
      message: err.message || "Insufficient Stock",
    });
  } else if (err.name === "InvalidPrice") {
    res
      .status(400)
      .json({ name: "InvalidPrice", message: err.message || "Invalid Price" });
  } else if (err.name === "InvalidOrderAction") {
    res.status(400).json({
      name: "InvalidOrderAction",
      message: err.message || "Invalid Order Action",
    });
  } else if (err.name === "UserExist") {
    res.status(409).json({
      name: "UserExist",
      message: err.message || "User Already Exist",
    });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
