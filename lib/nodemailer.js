const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const prisma = require("../lib/prisma");

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

const sendReviweReminders = async () => {
  const orders = await prisma.orders.findMany({
    where: {
      status: "completed",
      order_items: {
        some: {
          is_reviewed: false,
        },
      },
    },
    include: {
      order_items: {
        include: {
          product: true,
        },
      },
    },
  });
  for (const order of orders) {
    const itemName = order.order_items
      .map((item) => {
        if (item.is_reviewed == false) {
          return item.product.name;
        }
      })
      .filter((name) => name !== undefined);

    console.log("user please review", itemName);
  }
};

sendReviweReminders();

module.exports = { sendInvoiceEmail };
