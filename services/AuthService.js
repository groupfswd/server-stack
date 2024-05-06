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
      throw {
        name: "InvalidCredentials",
        message: "Email or password is wrong",
      };
    }

    const isValidPassword = validPassword(password, user.password);
    if (!isValidPassword) {
      throw {
        name: "InvalidCredentials",
        message: "Email or password is wrong",
      };
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    console.log(token);

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = { login, register };
