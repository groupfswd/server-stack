const authService = require("../services/AuthService");

const register = async (req, res, next) => {
  try {
    const newUser = req.body;
    const user = await authService.register(newUser);
    res.status(201).json({ message: "Register Success", data: user });
  } catch (err) {
    next(err)
  }
};

const login = async (req, res, next) => {
  try {
    const userLogin = req.body;
    const accessToken = await authService.login(userLogin);
    res.status(200).json({ message: "Login Success", accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
