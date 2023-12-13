import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import { handleUpload, hasLegalReason, isNotAuthorized } from './services/uploadHandler.js';
import { handleDownload } from './services/downloadHandler.js';
import { isValidFilename } from './utils/utils.js';
import BadFileType from './exception/BadFileType.js';
import CorruptedFile from './exception/CorruptedFile.js';
import DuplicatedFile from './exception/DuplicatedFile.js';
import FilenameInvalid from './exception/FilenameInvalid.js';
import FileNotFound from './exception/FileNotFound.js';
import FileTooLarge from './exception/FileTooLarge.js';
import LegalReason from './exception/LegalReason.js';
import LockException from './exception/LockException.js';
import NotAuthorized from './exception/NotAuthorized.js';
import NotImplemented from './exception/NotImplemented.js';
import RequestTimeout from './exception/RequestTimeout.js';
import SensitiveFile from './exception/SensitiveFile.js';
import ServerDown from './exception/ServerDown.js';
import ServerError from './exception/ServerError.js';
import StockageInsuffisantCloud from './exception/StorageInsufficientCloud.js'; 
import TooManyRequests from './exception/TooManyRequest.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirectory = path.join(__dirname, 'images');
const videoDirectory = path.join(__dirname, 'videos');
const pdfDirectory = path.join(__dirname, 'pdf');
const wordDirectory = path.join(__dirname, 'word');

const app = express();
const port = 3000;

app.use((req, _, next) => {
  req.requestTimestamp = Date.now();
  next();
});


app.use(express.raw({
  type: ['image/*', 'video/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  limit: '10mb'
}));

const isServerDown = async () => {
  try {
    const response = await fetch('http://localhost:' + port);
    return !response.ok;
  } catch (error) {
    console.error('Error checking server status:', error);
    return true;
  }
};

const isCloudStorageFull = async () => {
  try {
    const cloudStorageInfo = await fetch('https://cloud-storage-api.com/info');
    const cloudStorageData = await cloudStorageInfo.json();

    const freeSpace = cloudStorageData.freeSpace;
    const storageThreshold = 100 * 1024 * 1024; 
    
    return freeSpace < storageThreshold;
  } catch (error) {
    console.error('Error checking cloud storage status:', error);
    return true;
  }
};

const isTooManyRequests = async () => {
  try {
    const requestTrackingInfo = await fetch('https://request-tracking-api.com/info');
    const requestTrackingData = await requestTrackingInfo.json();

    const recentRequests = requestTrackingData.recentRequests;
    const requestThreshold = 100; 

    return recentRequests > requestThreshold;
  } catch (error) {
    console.error('Error checking recent requests:', error);
    return true;
  }
};

const handleExceptions = async (req, res, handlerFunction, directory) => {
  try {
    if (await isServerDown()) {
      throw new ServerDown('The server is currently down');
    }

    if (await isCloudStorageFull()) {
      throw new StockageInsuffisantCloud('Cloud storage is full');
    }

    if (await isTooManyRequests()) {
      throw new TooManyRequests('Too many requests');
    }

    const file = req.body;

    if (!isValidFilename(file.name)) {
      throw new FilenameInvalid('Invalid filename');
    }

    if (hasLegalReason(file)) {
      throw new LegalReason('File upload blocked for legal reasons');
    }

    if (isNotAuthorized(file)) {
      throw new NotAuthorized('Not authorized to upload this file');
    }

    if (isNotImplemented(file)) {
      throw new NotImplemented('Not implemented for this file');
    }

    if (isRequestTimeout(file)) {
      throw new RequestTimeout('Request timeout');
    }

    if (isSensitiveFile(file)) {
      throw new SensitiveFile('Sensitive file upload is not allowed');
    }

    const filePath = await handlerFunction(file, directory);
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    if (error instanceof BadFileType || error instanceof CorruptedFile || error instanceof DuplicatedFile || error instanceof FilenameInvalid || error instanceof FileNotFound || error instanceof FileTooLarge || error instanceof LegalReason || error instanceof LockException || error instanceof NotAuthorized || error instanceof NotImplemented || error instanceof RequestTimeout || error instanceof SensitiveFile || error instanceof ServerDown || error instanceof StockageInsuffisantCloud || error instanceof TooManyRequests) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
      throw new ServerError('Internal server error');
    }
  }
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
