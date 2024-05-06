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

const login = async (req, res, next) => {
  try {
    const userLogin = req.body;
    await authService.login(userLogin);
    res.status(200).json({ message: "Login Success" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
