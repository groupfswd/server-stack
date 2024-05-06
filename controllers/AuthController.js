const authService = require("../services/AuthService");

const register = async (req, res, next) => {
  try {
    const newUser = req.body;
    const user = await authService.register(newUser);
    res.status(201).json({ message: "Register Success" });
  } catch (err) {
    throw new Error(err);
  }
};

const login = (req, res, next) => {
  try {
    const userLogin = req.body;
    const data = authService.login(userLogin);
    res.status(200).json({ message: "Login Success", data: data });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  register,
  login,
};
