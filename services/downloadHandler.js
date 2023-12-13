import path from 'path';
import fs from 'fs/promises';

export const handleDownload = async (filename,directory) => {
    const files = await fs.readdir(directory);
    const matchingFile = files.find((file) =>
      path.parse(file).name === filename
    );

    if (!matchingFile) {
      return res.status(404).send('File not found');
    }
    return path.join(directory, matchingFile);
}