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
  const updatedFiles = [];

  try {
    // Get the list of files in the scraper directory
    const scriptDir = path.dirname(__filename);

    // Construct the absolute path to the scrapper folder
    const scrapperDir = path.join(scriptDir, '../../scrapper');

    // Read the files from the scrapper directory
    const files = fs.readdirSync(scrapperDir);

    // Process each file
    files.forEach((file) => {
      // Check if the file was modified after the last commit/push
      const modifiedTime = fs.statSync(filePath).mtime;
      const lastPushTime = getLastPushTime(); // Implement a function to get the last push time

      if (modifiedTime > lastPushTime) {
        updatedFiles.push(file); // Collect updated file names
      }
    });
  } catch (error) {
    console.error('Error reading directory:', error);
  }

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
