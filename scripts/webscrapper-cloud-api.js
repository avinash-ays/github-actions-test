// Importing client from "../config" assuming it exports required functions
const client = require("./config");

async function getSitemaps() {
    try {
        let generator = client.getSitemaps();
        return await generator.getAllRecords();
    } catch (error) {
        console.error("Failed to get Sitemaps:", error);
    }
}

async function createSitemap(sitemap) {
    try {
        return await client.createSitemap(sitemap);
    } catch (error) {
        console.error("Failed to create sitemap:", error.message);
    }
}

async function getSitemapById(id) {
    try {
        return await client.getSitemap(id);
    } catch (error) {
        console.error("Failed to get sitemap:", error);
    }
}

async function deleteSitemap(sitemapId) {
    try {
        return await client.deleteSitemap(sitemapId);
    } catch (error) {
        console.error("Failed to delete sitemap:", error);
    }
}

async function updateSitemap(sitemap) {
    try {
        return await client.updateSitemap(sitemap);
    } catch (error) {
        console.error("Failed to update sitemap", error);
    }
}

async function createScrapJob(id,sitemap) {
    try {
        return await client.createScrapingJob({
            sitemap_id: id,
            driver: "fulljs",
            page_load_delay: 2000,
            request_interval: 2000,
            proxy: 0,
            start_urls: sitemap?.startUrl,
        })
    } catch (error) {
        console.error("Failed to create Scrap Job", error.message);
    }
}

module.exports = {
    getSitemaps,
    createSitemap,
    getSitemapById,
    deleteSitemap,
    updateSitemap,
    createScrapJob,
};
