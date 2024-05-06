const { hashPassword, validPassword } = require("../lib/bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../lib/jwt");
const prisma = new PrismaClient();

const register = async (params) => {
  try {
    const { fullname, email, password, phone_number } = params;
    const hashedPassword = hashPassword(password);
    const user = await prisma.users.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        phone_number,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
};

const login = async (params) => {
  try {
    const { email, password } = params;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User Not Found");
    }

    const isValidPassword = validPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid Password");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { login, register };
