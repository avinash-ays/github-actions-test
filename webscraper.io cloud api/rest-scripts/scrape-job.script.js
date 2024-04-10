const fs = require('fs').promises; // Importing fs promises API
const client = require("../config");

// get the cloud sitemaps from webscrapper.io cloud
async function getCloudSitemaps() {
  try {
    let generator = client.getSitemaps();
    return await generator.getAllRecords();
  } catch (error) {
    console.error("Failed to get cloud sitemaps: " + error);
    throw error; // Re-throw the error to propagate it upwards
  }
}

// fetch all local sitemaps from scrapper folder
async function getFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    const fileObjects = await Promise.all(files.map(async file => {
      const data = await fs.readFile(`${dir}/${file}`, 'utf8');
      return { name: file.replace(/\.json$/, ""), data: JSON.parse(data) };
    }));
    return fileObjects;
  } catch (error) {
    console.error("Error reading local sitemap files: " + error);
    throw error; // Re-throw the error to propagate it upwards
  }
}

async function updateCloudSitemaps(local, cloud) {
  const localNames = local.map(item => item.name);
  const cloudNames = cloud.map(item => item.name);

  const localValuesNotInCloud = local.filter(item => !cloudNames.includes(item.name));
  const cloudValuesNotInLocal = cloud.filter(item => !localNames.includes(item.name));
    
  console.log("localValuesNotInCloud : ", localValuesNotInCloud);
  console.log("cloudValuesNotInLocal : ", cloudValuesNotInLocal);
  return {
      localValuesNotInCloud,
      cloudValuesNotInLocal
  };
}

async function main() {
  try {
    const cloudSitemaps = await getCloudSitemaps();
    const localSitemaps = await getFiles('scrapper');

    // Stringify data of local sitemaps
    const stringifiedLocalSitemaps = localSitemaps.map(sitemap => {
      return { name: sitemap.name, data: JSON.stringify(sitemap.data) };
    });

    await updateCloudSitemaps(stringifiedLocalSitemaps, cloudSitemaps);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
