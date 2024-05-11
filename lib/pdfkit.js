const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const uniqueSuffix = Math.random().toString(36).substring(2, 8);
const timestamp = new Date().getTime();
const randomFileName = `invoice_${timestamp}_${uniqueSuffix}.pdf`;

// pdf nya belum jadi

async function createPdf(data) {
  const doc = new PDFDocument();
  const outputPath = path.join(
    __dirname,
    `../public/invoice/${randomFileName}`
  );
  doc.pipe(fs.createWriteStream(outputPath));

  doc.text("Hello World", 100, 100);

  doc.end();

  const relativePath = path.relative(__dirname, outputPath);
  return relativePath;
}

module.exports = { createPdf };
