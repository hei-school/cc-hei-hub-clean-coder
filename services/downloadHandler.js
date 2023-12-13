import path from 'path';
import fs from 'fs/promises';
import FileNotFound from '../exception/FileNotFound.js';

export const handleDownload = async (filename, directory) => {
  try {
    const files = await fs.readdir(directory);
    const matchingFile = files.find((file) =>
      path.parse(file).name === filename
    );

    if (!matchingFile) {
      throw new FileNotFound('File not found');
    }

    const filePath = path.join(directory, matchingFile);
    return filePath;
  } catch (error) {
    throw error; 
  }
};
