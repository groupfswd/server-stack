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

const sendInvoiceEmail = async (user_email, pdf) => {
  const pdfPath = path.join(__dirname, pdf);
  await transporter.sendMail({
    from: {
      name: "MnB Store",
      address: process.env.EMAIL_SMTP,
    },
    to: user_email,
    subject: "Invoice",
    html: `
  <b>Pelanggan toko MnB yang terhormat</b>
  <p>Ini adalah email invoice untuk transaksi Anda.</p>
  <p>Terima kasih telah berbelanja di toko kami.</p>
`,
    attachments: [
      {
        filename: "invoice.pdf",
        path: pdfPath,
        contentType: "application/pdf",
      },
    ],
  });

  console.log("Message sent:");
};

module.exports = { sendInvoiceEmail };
