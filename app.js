import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { handleUpload } from './services/uploadHandler.js';
import { handleDownload } from './services/downloadHandler.js';
import { isValidFilename } from './utils/utils.js';
import BadFileType from './exception/BadFileType.js';
import CorruptedFile from './exception/CorruptedFile.js';
import DuplicatedFile from './exception/DuplicatedFile.js';
import FilenameInvalid from './exception/FilenameInvalid.js';
import FileNotFound from './exception/FileNotFound.js';
import FileTooLarge from './exception/FileTooLarge.js';
import LegalReason from './exception/LegalReason.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirectory = path.join(__dirname, 'images');
const videoDirectory = path.join(__dirname, 'videos');
const pdfDirectory = path.join(__dirname, 'pdf');
const wordDirectory = path.join(__dirname, 'word');

const hasLegalReason = (file) => {
  return file.name.toLowerCase().includes('illegal');
};

const app = express();
const port = 3000;

app.use(express.raw({
  type: ['image/*', 'video/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  limit: '10mb'
}));

const handleExceptions = async (req, res, handlerFunction, directory) => {
  try {
    const file = req.body;

    if (!isValidFilename(file.name)) {
      throw new FilenameInvalid('Invalid filename');
    }

    if (hasLegalReason(file)) {
      throw new LegalReason('File upload blocked for legal reasons');
    }

    const filePath = await handlerFunction(file, directory);
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    if (error instanceof BadFileType || error instanceof CorruptedFile || error instanceof DuplicatedFile || error instanceof FilenameInvalid || error instanceof FileNotFound || error instanceof FileTooLarge || error instanceof LegalReason) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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
    await fs.writeFile(filePath, file);
    return filePath;
  } catch (error) {
    if (error instanceof BadFileType || error instanceof CorruptedFile || error instanceof DuplicatedFile || error instanceof FilenameInvalid) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
};

export const handleDownload = async (filename, directory) => {
  const files = await fs.readdir(directory);
  const matchingFile = files.find((file) =>
    path.parse(file).name === filename
  );

  if (!matchingFile) {
    throw new FileNotFound('File not found');
  }

  return path.join(directory, matchingFile);
};

app.post('/upload/image', async (req, res) => {
  await handleExceptions(req, res, handleUpload, imageDirectory);
});

app.post('/upload/video', async (req, res) => {
  await handleExceptions(req, res, handleUpload, videoDirectory);
});

app.post('/upload/pdf', async (req, res) => {
  await handleExceptions(req, res, handleUpload, pdfDirectory);
});

app.post('/upload/word', async (req, res) => {
  await handleExceptions(req, res, handleUpload, wordDirectory);
});

app.get('/download/image', async (req, res) => {
  await handleExceptions(req, res, handleDownload, imageDirectory);
});

app.get('/download/video', async (req, res) => {
  await handleExceptions(req, res, handleDownload, videoDirectory);
});

app.get('/download/pdf', async (req, res) => {
  await handleExceptions(req, res, handleDownload, pdfDirectory);
});

app.get('/download/word', async (req, res) => {
  await handleExceptions(req, res, handleDownload, wordDirectory);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});