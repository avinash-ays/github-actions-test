const fs = require('fs').promises; // Importing fs promises API
const client = require("../config");

//get the cloud sitemaps from webscrapper.io cloud
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
    console.log("Local sitemaps:", local);
    console.log("Cloud sitemaps:", cloud);
}

async function main() {
    try {
        const cloudSitemaps = await getCloudSitemaps();
        const localSitemaps = await getFiles('scrapper');
        await updateCloudSitemaps(localSitemaps, cloudSitemaps);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
