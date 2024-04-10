const fs = require('fs').promises;
const { execSync } = require('child_process');

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

function identifyModifiedFiles(folderPath) {
    try {
        // Use git diff to get the list of modified files in the specified folder
        const command = `git diff --name-only HEAD^ HEAD -- ${folderPath}`;
        const modifiedFiles = execSync(command).toString().trim().split('\n');
        
        // Return the modified files
        return modifiedFiles;
    } catch (error) {
        console.error('Error identifying modified files:', error);
        return [];
    }
}

module.exports = {
    readLocalSitemaps,
    identifyModifiedFiles
};
