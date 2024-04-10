const fs = require('fs')
const client = require("../config");

//get the cloud sitemaps from webscrapper.io cloud
async function getCloudSitemaps() {
  try {
    let generator = client.getSitemaps();
    return await generator.getAllRecords();
  } catch (error) {
    console.error("failed to get cloud sitemap's" + error);
  }
}
// fetch all local sitemaps from scrapper folder
function getFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    const fileObjects = files.map(file => {
        const data = fs.readFileSync(`${dir}/${file}`, 'utf8');
        return { name: file.replace(/\.json$/, ""), data: JSON.parse(data) };
    });
    return fileObjects;
  } catch (error) {
    console.error("error parsing JSON file" + error);    
  }
}

function updateCloudSitemaps(local,cloud){
  console.log(
}

const cloudSitemaps = getCloudSitemaps();
const localSitemaps = getFiles('scrapper')
const updateCloudSitemaps(localSitemaps,cloudSitemaps);