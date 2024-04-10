const fs = require('fs')
const client = require("../config");
const Sitemaps = []
async function updateSitemaps() {
  //get the sitemaps from cloud.webscraper.io
  let generator = client.getSitemaps();
  Sitemaps = await generator.getAllRecords();
  console.log("SITEMAPS", Sitemaps);
}

updateSitemaps();

// Recursive function to get files
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir)
  console.log('Reading files:', fileList);

  return files
}
const filesInFolder = getFiles('scrapper')
console.log(filesInFolder);