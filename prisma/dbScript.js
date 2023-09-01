/* eslint-disable */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const parse = require("csv-parser");
const path = require("path");

const prisma = new PrismaClient();
async function clearDatabase() {
  try {
    await prisma.player.deleteMany({});
    // Add more deleteMany calls for other models if needed

    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing the database:", error);
  }
}

async function importCsvData() {
  const csvFilePath = path.join(__dirname, "CSV_UPLOAD.csv");

  // Clear the database before importing
  await clearDatabase();

  console.log("in import csv");
  fs.createReadStream(csvFilePath)
    .pipe(parse({ mapHeaders: ({ header, index }) => header.trim() }))
    .on("data", async (row) => {
      await prisma.player.create({
        data: {
          name: row.player || "NA", // Map 'player' column to 'name' field
          role: row.pos, // Map 'pos' column to 'role' field
          adp: parseFloat(row.adp), // Map 'adp' column to 'adp' field as a number
          team: row.team || "N/A",
          bye: parseInt(row.bye, 10) || -1,
        },
      });
    })
    .on("end", () => {
      console.log("CSV data imported into the database.");
      prisma.$disconnect(); // Disconnect the Prisma client after import
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
