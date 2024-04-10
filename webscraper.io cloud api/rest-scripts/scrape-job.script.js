const fs = require('fs')
const client = require("../config");
let cloudSitemaps = []
async function getCloudSitemaps() {
  //get the sitemaps from cloud.webscraper.io
  let generator = client.getSitemaps();
  cloudSitemaps = await generator.getAllRecords();
  console.log("Cloud-Sitemaps", cloudSitemaps);
}
getCloudSitemaps();

function getFiles(dir, files = []) {
  return fs.readdirSync(dir)
}
const localSitemaps = getFiles('scrapper')
console.log(localSitemaps);