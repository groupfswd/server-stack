const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const uniqueSuffix = Math.random().toString(36).substring(2, 8);
const timestamp = new Date().getTime();
const randomFileName = `invoice_${timestamp}_${uniqueSuffix}.pdf`;

// this is not finish yet just a sample

async function createPdf(data) {
  const product_name = data.user.fullname;
  console.log(product_name);
  const doc = new PDFDocument();
  const outputPath = path.join(
    __dirname,
    `../public/invoice/${randomFileName}`
  );
  doc.pipe(fs.createWriteStream(outputPath));

  doc.text("nama pembeli: ikram syawal alitu", 20, 100);
  doc.text("nama toko: Toko MnB", 300, 100);
  doc.moveDown();
  doc.text("alamat jalan ini kelurahan itu kota dia provinsi nah", 20);
  doc.text("No. Handphone Pembeli: 0812323279");
  doc.moveDown();
  doc.text("waktu pembayaran: 22/4/2023");
  doc.text("jasa kirim: JNE");

  doc.moveDown();
  doc.text("Rincian Produk");
  doc.moveTo(20, 230).lineTo(580, 230).stroke();
  doc.moveDown();
  doc.text("No", 20, 240);
  doc.text("Produk", 70, 240);
  doc.text("SubTotal", 450, 240);
  doc.moveTo(20, 260).lineTo(580, 260).stroke();
  doc.moveDown();

  // produk goes here

  doc.text("1", 20, 280);
  doc.text("Baby Cloth x 2", 70, 280);
  doc.text("1500000", 450, 280);

  doc.moveDown();
  doc.text("Total: 3000000");

  doc.end();

  const relativePath = path.relative(__dirname, outputPath);
  return relativePath;
}

module.exports = { createPdf };
