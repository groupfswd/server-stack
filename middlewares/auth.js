const { verifyToken } = require("../lib/jwt");
const prisma = require("../lib/prisma")

const authentication = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split(" ")[1];
      const { id, email, role } = verifyToken(accessToken);
      const user = await prisma.users.findUnique({
        where: {
          id: id,
        },
      });

      if (user) {
        req.loggedUser = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        next();
      } else {
        throw {
          name: "Unauthenticated",
        };
      }
    } else {
      throw {
        name: "Unauthenticated",
      };
    }
  } catch (err) {
    next(err);
  }
};

const authorization = async (req, res, next) => {
  try {
    const { role } = req.loggedUser;
    if (role === "admin") {
      next();
    } else {
      throw {
        name: "Unauthorized",
      };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication, authorization };
