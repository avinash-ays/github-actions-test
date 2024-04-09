const axios = require('axios');

async function startScrapingJob() {
    try {
        const API_TOKEN = process.env.WEBSCRAPER_API_TOKEN; // Assuming you have your API token stored in an environment variable

        const response = await axios.post('https://api.webscraper.io/api/v1/scraping-job', {
            api_token: API_TOKEN,
            // Add other parameters as required by the Webscraper.io API
        });

        console.log('Scraping job started successfully:', response.data);
    } catch (error) {
        console.error('Error starting scraping job:', error.message);
    }
}

startScrapingJob();
