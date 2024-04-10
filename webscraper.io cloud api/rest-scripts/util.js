const fs = require('fs').promises;

async function readLocalSitemaps(dir) {
    try {
        const files = await fs.readdir(dir);
        const fileObjects = await Promise.all(files.map(async file => {
            const data = await fs.readFile(`${dir}/${file}`, 'utf8');
            return { name: file.replace(/\.json$/, ""), data: JSON.parse(data) };
        }));
        return fileObjects;
    } catch (error) {
        console.error("Error reading local sitemap files:", error);
        throw error;
    }
}

module.exports = {
    readLocalSitemaps
};
