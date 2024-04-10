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

// Function to identify updated files within a specific folder
function identifyUpdatedFiles(folderPath) {
  try {
    // Run the Git command to identify updated files
 
    const command = `git diff --name-only HEAD origin/main -- ${folderPath}/`;
    const updatedFiles = execSync(command, { encoding: 'utf-8' });

    // Split the output by newline character to get a list of updated file names
    const updatedFileList = updatedFiles.trim().split('\n');

    // Print the list of updated files
    console.log(`Updated files within the folder ${folderPath}:`);
    console.log(updatedFileList);

    // You can perform any additional tasks based on the list of updated files here
  } catch (error) {
    console.error('Error identifying updated files:', error);
  }
}

module.exports = {
    readLocalSitemaps,
    identifyUpdatedFiles
};
