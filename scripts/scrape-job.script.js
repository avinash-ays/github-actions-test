const { readLocalSitemaps, findDiffSitemaps } = require('./util');
const { getSitemaps, createSitemap, deleteSitemap, createScrapJob } = require('./webscrapper-cloud-api');

async function main() {
  try {
    const cloudSitemaps = await getSitemaps();
    const localSitemaps = await readLocalSitemaps('scrapper/');

    console.log('cloudSitemaps =>',cloudSitemaps);
    console.log('localSitemaps =>',localSitemaps);

    // Stringify data of local sitemaps
    const stringifiedLocalSitemaps = localSitemaps.map(sitemap => ({
      name: sitemap.name,
      data: JSON.stringify(sitemap.data)
    }));

    // Get the list of sitemaps to update and delete
    const { toCreateOnCloud, toDeleteOnCloud } = await findDiffSitemaps(stringifiedLocalSitemaps, cloudSitemaps);
    console.log("toCreateOnCloud =>", toCreateOnCloud);
    console.log("toDeleteOnCloud =>", toDeleteOnCloud);

    // delete sitemap which are not present on repo dir scrapper
    for (const cloud of toDeleteOnCloud) {
      await deleteSitemap(cloud.id);
    }

    // Create sitemaps which are not on cloud
    for (const local of toCreateOnCloud) {
      //create a new sitemap
       await createSitemap(local.data);
      //start new scrap-job for new sitemap created
      // await createScrapJob(sitemap.id, JSON.parse(local.data));
    }
    
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
