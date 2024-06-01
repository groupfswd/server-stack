const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const prisma = require("../lib/prisma");
const dayjs = require("dayjs");

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
      name: "Baby Wonders",
      address: process.env.EMAIL_SMTP,
    },
    to: user_email,
    subject: "Invoice",
    html: `
  <b>Dear customer of Baby Wonders store,</b>
  <p>This is an invoice email for your transaction.</p>
  <p>Thank you for shopping at our store.</p>
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
      status: "delivered",
      delivered_at: {
        lt: dayjs().subtract(1, "minutes").toDate(),
      },
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
      user: {
        select: {
          fullname: true,
          email: true,
        },
      },
    },
  });
  for (const order of orders) {
    const itemName = order.order_items
      .map((item, index) => {
        if (item.is_reviewed == false) {
          return index + 1 + ". " + item.product.name + "\n";
        }
      })
      .filter((name) => name !== undefined);

    // console.log(itemName, "please review");

    await transporter.sendMail({
      from: {
        name: "Baby Wonders",
        address: process.env.EMAIL_SMTP,
      },
      to: order.user.email,
      subject: "Review Reminder",
      html: `
    <h3>Hi, ${order.user.fullname}</h3>
    <p>Dear Baby Wonders store customers</p>
    <p>Thank you for your purchase! We hope you are satisfied with the product you have purchased.</p>
    <p>Could you please take a moment to leave a review to your purchase: </p> 

    <p>${itemName}</p>
    <p>Your feedback is valuable to us and helps us continue to improve the quality of our products and services.</p>
    <p>Thank you for shopping at our store and for taking the time to leave a review.</p>

    <p>Best regards,</p>
    <br>
    <p>Baby Wonders</p>
    `,
    });
  }
};

module.exports = { sendInvoiceEmail, sendReviweReminders };
