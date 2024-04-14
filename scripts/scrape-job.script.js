const { readLocalSitemaps, findDiffSitemaps } = require('./util');
const { getSitemaps, createSitemap, deleteSitemap, createScrapJob } = require('./webscrapper-cloud-api');
const path = require('path');
const fs = require('fs').promises;


async function isLocalDirPresent(dirPath) {
  try {
    await fs.access(dirPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

// Adidas-Mens__4c507cd4edbe9f71c1c1426f07d6cffc4ecb94c5
// GoatSitemap-Mens__88732aebbd529c525e4cf6185405cc87c349c53b
// samsclub-com-products__cfb309f9e4a1d2a747c4aec838ab6d2995f54aec

async function main() {
  try {
    // console.log("Fetching cloud sitemaps...");
    const cloudSitemaps = await getSitemaps();
    console.log('cloudSitemaps =>', cloudSitemaps);

    const isLocalDir = await isLocalDirPresent("scrapper/")
    console.log('isLocalDir =>', isLocalDir);
    let localSitemaps = [];
    if(isLocalDir){
      // console.log("Reading local sitemaps...");
      localSitemaps = await readLocalSitemaps('scrapper/');
      console.log('localSitemaps =>', localSitemaps);
    }
    
    console.log("Comparing sitemaps...");
    const { toCreateOnCloud, toDeleteOnCloud } = await findDiffSitemaps(localSitemaps, cloudSitemaps);
    console.log("toCreateOnCloud =>", toCreateOnCloud);
    console.log("toDeleteOnCloud =>", toDeleteOnCloud);


    console.log("Deleting the sitemaps not present on cloud...");
    for (const cloud of toDeleteOnCloud) {
      console.log("deleting cloud sitemap : ", cloud.name);
      await deleteSitemap(cloud.id);
    }

    console.log("Creating the sitemaps not on cloud...");
    for (const local of toCreateOnCloud) {
      // Read local file data
      const data = await fs.readFile(path.join("scrapper/", local.filename), 'utf8');
      const jsonData = JSON.parse(data);
      const updatedJson = {...jsonData, _id : local.name};

      // Create a new sitemap
      console.log("Creating Sitemap:", local.name);
      await createSitemap(JSON.stringify(updatedJson));
      // Start new scrap-job for new sitemap created
      // await createScrapJob(sitemap.id, JSON.parse(local.data));
    }

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
