const client = require("../config");

async function updateSitemaps() {
    //get the sitemaps from cloud.webscraper.io
    let generator = client.getSitemaps();
    const sitemaps = await generator.getAllRecords();

    console.log("SITEMAPS", sitemaps);
}

updateSitemaps();

const fs = require('fs');
const path = require('path');

async function getUpdatedFiles() {
  const scraperPath = path.join(__dirname, '../../../scraper');
  const updatedFiles = [];

  // Get the list of files in the scraper directory
  const files = fs.readdirSync(scraperPath);

  // Process each file
  files.forEach(async (file) => {
    const filePath = path.join(scraperPath, file);

    // Check if the file was modified after the last commit/push
    const modifiedTime = fs.statSync(filePath).mtime;
    const lastPushTime = getLastPushTime(); // Implement a function to get the last push time

    if (modifiedTime > lastPushTime) {
      updatedFiles.push(file); // Collect updated file names
    }
  });

  return updatedFiles;
}

function getLastPushTime() {
  // Implement logic to get the time of the last commit/push
  // You can use git commands or retrieve it from your version control system
}

(async () => {
  const updatedFiles = await getUpdatedFiles();
  console.log('Updated files:', updatedFiles);
})();

