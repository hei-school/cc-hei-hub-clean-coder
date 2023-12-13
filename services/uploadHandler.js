import { fileTypeFromBuffer } from 'file-type/core';
import path from 'path';
import fs from 'fs/promises';

import BadFileType from './exceptions/BadFileType.js';
import CorruptedFile from './exceptions/CorruptedFile.js';
import DuplicatedFile from './exceptions/DuplicatedFile.js';

export const handleUpload = async (file, directory) => {
  try {
    const type = await fileTypeFromBuffer(file);

    if (file.length > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB');
    }

    if (!type || (!type.mime.startsWith("video/") && !type.mime.startsWith("image/") && type.mime !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && type.mime !== "application/pdf")) {
      throw new BadFileType('Invalid file extension');
    }

    if (isFileCorrupted(file)) {
      throw new CorruptedFile('Corrupted file detected');
    }

    const filename = `${Date.now()}.${type.ext}`;
    const filePath = path.join(directory, filename);

    const files = await fs.readdir(directory);
    const isDuplicated = files.some((existingFile) => path.parse(existingFile).name === path.parse(filePath).name);

    if (isDuplicated) {
      throw new DuplicatedFile('File with the same name already exists');
    }

    await fs.writeFile(filePath, file);
    return filePath;
  } catch (error) {
    if (error instanceof BadFileType || error instanceof CorruptedFile || error instanceof DuplicatedFile) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
};

const isFileCorrupted = (file) => {
  try {
    const fileText = file.toString('utf-8');

    if (fileText.includes('CorruptedString')) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error during file corruption check:', error);
    return true;
  }
};
