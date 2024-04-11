const fs = require('fs').promises;
const { execSync } = require('child_process');
const path = require('path');

async function readLocalSitemaps(dir) {
  try {
      const files = await fs.readdir(dir);
      const fileObjects = await Promise.all(files.map(async file => {
          const data = await fs.readFile(path.join(dir, file), 'utf8');
          const checksum = execSync(`git show HEAD:${path.join(dir, file)} | shasum | awk '{print $1}'`, { encoding: 'utf-8' }).trim();
          const fileNameWithoutExtension = path.parse(file).name;
          return { name: `${fileNameWithoutExtension}__${checksum}`, data: JSON.parse(data) };
      }));
      return fileObjects;
  } catch (error) {
      console.error("Error reading local sitemap files:", error);
      throw error;
  }
}

async function findDiffSitemaps(local, cloud) {
  const localNames = local.map(item => item.name);
  const cloudNames = cloud.map(item => item.name);

  const toCreateOnCloud = local.filter(item => !cloudNames.includes(item.name));
  const toDeleteOnCloud = cloud.filter(item => !localNames.includes(item.name));

  return {
    toCreateOnCloud,
    toDeleteOnCloud
  };
}

module.exports = {
    readLocalSitemaps,
    findDiffSitemaps,
};
