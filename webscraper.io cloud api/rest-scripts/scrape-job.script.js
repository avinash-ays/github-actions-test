const { readLocalSitemaps, identifyUpdatedFiles } = require('./util');
const { getSitemaps, createSitemap, deleteSitemap, createScrapJob } = require('./webscrapper-cloud-api');

async function findDiffSitemaps(local, cloud) {
  const localNames = local.map(item => item.name);
  const cloudNames = cloud.map(item => item.name);

  const localValuesNotInCloud = local.filter(item => !cloudNames.includes(item.name));
  const cloudValuesNotInLocal = cloud.filter(item => !localNames.includes(item.name));

  return {
    localValuesNotInCloud,
    cloudValuesNotInLocal
  };
}

async function main() {
  try {
    const cloudSitemaps = await getSitemaps();
    const localSitemaps = await readLocalSitemaps('scrapper');

    // Stringify data of local sitemaps
    const stringifiedLocalSitemaps = localSitemaps.map(sitemap => ({
      name: sitemap.name,
      data: JSON.stringify(sitemap.data)
    }));
    // 
    const { localValuesNotInCloud, cloudValuesNotInLocal } = await findDiffSitemaps(stringifiedLocalSitemaps, cloudSitemaps);

    //delete sitemap which are not present in local scrapper folder
    for (const cloud of cloudValuesNotInLocal) {
      await deleteSitemap(cloud.id);
    }

    // Create sitemaps which are not in cloud
    for (const local of localValuesNotInCloud) {
      //create a new sitemap
      const sitemap = await createSitemap(local.data);
      //start new scrap-job for new sitemap created
      await createScrapJob(sitemap.id, JSON.parse(local.data))
    }

    // Call the function to identify modified files in the "myFolder" folder
    console.log('calling diff function');
    const modifiedFiles = identifyUpdatedFiles();
    console.log('Modified Files in scrapper', + ':');
    console.log(modifiedFiles.length >0 ? modifiedFiles .join('\n'):[]);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
