import { fileTypeFromBuffer } from 'file-type/core';
import path from 'path';
import fs from 'fs/promises';
import { isValidFilename } from '../utils/utils.js';

import BadFileType from '../exception/BadFileType.js';
import CorruptedFile from '../exception/CorruptedFile.js';
import DuplicatedFile from '../exception/DuplicatedFile.js';
import FilenameInvalid from '../exception/FilenameInvalid.js';
import FileTooLarge from '../exception/FileTooLarge.js';
import LegalReason from '../exception/LegalReason.js';

export const handleUpload = async (file, directory) => {
  try {
    const type = await fileTypeFromBuffer(file);

    if (file.length > 10 * 1024 * 1024) {
      throw new FileTooLarge('File size exceeds 10MB');
    }

    if (!type || (!type.mime.startsWith("video/") && !type.mime.startsWith("image/") && type.mime !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && type.mime !== "application/pdf")) {
      throw new BadFileType('Invalid file extension');
    }

    if (isFileCorrupted(file)) {
      throw new CorruptedFile('Corrupted file detected');
    }

    const filename = `${Date.now()}.${type.ext}`;

    if (!isValidFilename(filename)) {
      throw new FilenameInvalid('Invalid characters in the filename');
    }

    const filePath = path.join(directory, filename);

    const files = await fs.readdir(directory);
    const isDuplicated = files.some((existingFile) => path.parse(existingFile).name === path.parse(filePath).name);

    if (isDuplicated) {
      throw new DuplicatedFile('File with the same name already exists');
    }

    if (hasLegalReason(file)) {
      throw new LegalReason('File upload blocked for legal reasons');
    }

    await fs.writeFile(filePath, file);
    return filePath;
  } catch (error) {
    if (error instanceof BadFileType || error instanceof CorruptedFile || error instanceof DuplicatedFile || error instanceof FilenameInvalid || error instanceof FileTooLarge || error instanceof LegalReason) {
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

const hasLegalReason = (file) => {
  return file.name.toLowerCase().includes('illegal');
};
