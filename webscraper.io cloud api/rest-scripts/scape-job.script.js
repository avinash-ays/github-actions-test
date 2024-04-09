const { client } = require('../config');

async function startScrapingJob() {
    try {
        const response = await client.getSitemaps();
        console.log('Scraping job started successfully:', response.data);
    } catch (error) {
        console.error('Error starting scraping job:', error.message);
    }
}

startScrapingJob();
