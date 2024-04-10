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
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir)
  console.log('Reading files:', fileList);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    file
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(file).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(file, files)
    } else {
      // If it is a file, push the full path to the files array
      files.push(file)
    }
  }
  return files
}
const filesInFolder = getFiles('scrapper')
console.log(filesInFolder);