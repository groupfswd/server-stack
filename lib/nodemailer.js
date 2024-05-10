const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SMTP,
    pass: process.env.PASSWORD_SMTP,
  },
});

const sendInvoiceEmail = async (user_email) => {
  await transporter.sendMail({
    from: {
      name: "MnB Store",
      address: process.env.EMAIL_SMTP,
    },
    to: user_email,
    subject: "Invoice",
    text: "This Is Invocie",
    html: "<b>test email invoice</b>",
  });

  console.log("Message sent:");
};

module.exports = { sendInvoiceEmail };
