/* eslint-disable */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const parse = require("csv-parser");
const path = require("path");

const prisma = new PrismaClient();

async function importCsvData() {
  const csvFilePath = path.join(__dirname, "CSV_UPLOAD.csv");

  console.log("in import csv");
  fs.createReadStream(csvFilePath)
    .pipe(parse({ mapHeaders: ({ header, index }) => header.trim() }))
    .on("data", async (row) => {
      await prisma.player.create({
        data: {
          name: row.player,
          role: row.pos,
          adp: parseInt(row.avg, 10), // Assuming 'adp' is a number
          team: row.team || "N/A",
          bye: parseInt(row.bye, 10) || -1,
        },
      });
    })
    .on("end", () => {
      console.log("CSV data imported into the database.");
    });
}

async function main() {
  try {
    await importCsvData();
  } catch (error) {
    console.error("Error importing CSV data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().then(() => {
  //   process.exit(0);
});
