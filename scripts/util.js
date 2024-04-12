const fs = require('fs').promises;
const { execSync } = require('child_process');
const path = require('path');

async function readLocalSitemaps(dir) {
  try {
    const files = await fs.readdir(dir);
    const fileObjects = await Promise.all(files.map(async file => {
      const data = await fs.readFile(path.join(dir, file), 'utf8');
      const checksum = execSync(`git show HEAD:${path.join(dir, file)} | shasum | awk '{print $1}'`, { encoding: 'utf-8' }).trim();
      const jsonData = JSON.parse(data);
      const updatedData = { ...jsonData, _id: `${jsonData._id}__${checksum}` };
      const fileNameWithoutExtension = path.parse(file).name;
      return { name: `${fileNameWithoutExtension}__${checksum}`, data: updatedData };
    }));
    return fileObjects;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error("The 'scrapper' directory does not exist.");
      return [];
    } else {
      console.error("Error reading local sitemap files:", error);
      throw error;
    }
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

readLocalSitemaps('scrapper').then((res)=> console.log(res)).catch((err)=> console.log(err));