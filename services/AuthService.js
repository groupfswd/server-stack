const { hashPassword, validPassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt");
const prisma = require("../lib/prisma");

const register = async (params) => {
  const { fullname, email, password, phone_number } = params;

  const existUser = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (existUser) {
    throw {
      name: "UserExist",
      message: "User already exist",
    };
  }
  
  const hashedPassword = hashPassword(password);
  const user = await prisma.users.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
      phone_number,
      cart: {
        create: {},
      },
    },
  });
  return user;
};

const login = async (params) => {
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

  return token;
};

module.exports = { login, register };
