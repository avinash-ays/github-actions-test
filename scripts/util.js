const fs = require('fs').promises;
const { execSync } = require('child_process');
const path = require('path');

async function readLocalSitemaps(dir) {
  try {
    const files = await fs.readdir(dir);
    const fileObjects = await Promise.all(files.map(async file => {
      const checksum = execSync(`git show HEAD:${path.join(dir, file)} | shasum | awk '{print $1}'`, { encoding: 'utf-8' }).trim();
      const fileNameWithoutExtension = path.parse(file).name;
      const updatedFileName = `${fileNameWithoutExtension}__${checksum}`;
      return { filename: file, name: updatedFileName };
    }));
    return fileObjects;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error("The 'scrapper' directory does not exist.");
      return [];
    } else {
      console.error("Error appending checksum to file names:", error);
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

async function isLocalDirPresent(dirPath) {
  try {
    await fs.access(dirPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}


module.exports = {
  readLocalSitemaps,
  findDiffSitemaps,
  isLocalDirPresent,
};