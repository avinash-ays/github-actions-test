const client = require("../config");

async function startScrapingJob() {
    try {
        let generator = client.getSitemaps();
        const sitemaps = await generator.getAllRecords();
        console.log('Sitemaps are:', sitemaps);
    } catch (error) {
        console.error('Error getting sitemaps:', error.message);
    }
}

startScrapingJob();
