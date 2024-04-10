const fs = require('fs')
const client = require("../config");
const Sitemaps = []
async function getSitemaps() {
  //get the sitemaps from cloud.webscraper.io
  let generator = client.getSitemaps();
  Sitemaps = await generator.getAllRecords();

  console.log("SITEMAPS", Sitemaps);
}
getSitemaps();
//reading files from scrapper folder to check diff
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir)
  for (const file of fileList) {
    file
    if (fs.statSync(file).isDirectory()) {
      getFiles(file, files)
    } else {
      files.push(file)
    }
  }
  return files
}
const filesInFolder = getFiles('scrapper')
console.log("scrapper/files :----- ",filesInFolder);