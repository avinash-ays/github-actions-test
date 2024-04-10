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

function identifyModifiedFiles() {
    try {
        // Use git diff to get the list of modified files
        const modifiedFiles = execSync('git diff --name-only HEAD^ HEAD').toString().trim().split('\n');
        
        // Return the modified files
        return modifiedFiles;
    } catch (error) {
        console.error('Error identifying modified files:', error);
        return [];
    }
}

// Call the function to identify modified files
const modifiedFiles = identifyModifiedFiles();
console.log('Modified Files:');
console.log(modifiedFiles.join('\n'));



module.exports = {
    readLocalSitemaps
};
