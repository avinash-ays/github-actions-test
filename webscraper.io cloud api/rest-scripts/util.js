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
function identifyUpdatedFiles() {
  try {
      // Get the commit hash for HEAD dynamically
      const headHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
      
      // Get the commit hash for the parent commit dynamically
      const parentHash = execSync('git rev-parse HEAD~1', { encoding: 'utf-8' }).trim();

      // Run the Git command to identify updated files within the scrapper folder
      const command = `git diff --name-only ${parentHash} ${headHash} -- scrapper/`;
      const updatedFiles = execSync(command, { encoding: 'utf-8' });

      // Split the output by newline character to get a list of updated file names
      const updatedFileList = updatedFiles.trim().split('\n');
      
      // Print the list of updated files
      console.log(`Updated files within the scrapper folder:`);
      console.log(updatedFileList);

      return updatedFileList;
  } catch (error) {
      console.error('Error identifying updated files:', error);
  }
}

module.exports = {
  readLocalSitemaps,
  identifyUpdatedFiles
};
