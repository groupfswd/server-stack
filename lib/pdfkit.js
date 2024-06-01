const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const uniqueSuffix = Math.random().toString(36).substring(2, 8);
const timestamp = new Date().getTime();
const randomFileName = `invoice_${timestamp}_${uniqueSuffix}.pdf`;

const dayjs = require("dayjs");

// this is not finish yet just a sample

async function createPdf(data) {
  const product_name = data.user.fullname;
  const createdAt = dayjs(data.created_at);
  const paymentDueDate = createdAt.add(3, "day").format("YYYY-MM-DD");
  const doc = new PDFDocument();
  const outputPath = path.join(
    __dirname,
    `../public/invoices/${randomFileName}`
  );
  doc.pipe(fs.createWriteStream(outputPath));

  doc.text(`Name: ${product_name}`);
  doc.text(`Email: ${data.user.email}`);
  doc.text(`Phone: ${data.user.phone_number}`);
  doc.text(
    `Address: ${data.addresses.street_address} ${data.addresses.city.name} ${data.addresses.province} ${data.addresses.postal_code}`
  );
  doc.text(`Courier & service: ${data.courier} & ${data.shipping_method}`);
  doc.text(`Estimated days: ${data.estimated_day}`);
  doc.moveDown();

  // produk goes here

  doc.text(`Product:`);
  data.order_items.map((item) => {
    doc.text(
      `${item.product.name} x ${item.quantity} = ${item.price * item.quantity}`,
      {
        align: "right",
      }
    );
  });

  doc.moveDown();

  doc.text(`Subtotal: ${data.total_price}`, {
    align: "right",
  });
  doc.text(`Shipping cost: ${data.shipping_cost}`, {
    align: "right",
  });
  doc.text(`Total: ${data.total_price + data.shipping_cost}`, {
    align: "right",
  });

  doc.moveDown();

  doc
    .fontSize(10)
    .fillColor("red")
    .text(`**please pay before ${paymentDueDate}**`);
  doc.end();

  const relativePath = path.relative(__dirname, outputPath);
  return relativePath;
}

module.exports = { createPdf };
