import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';

import {handleUpload} from './services/uploadHandler.js'
import {handleDownload} from './services/downloadHandler.js'
import NotAuthorized from './exception/NotAuthorized.js';
import NotImplemented from './exception/NotImplemented.js';
import LockException from './exception/LockException.js'
import SensitiveFile from './exception/SensitiveFile.js';
import ServerDown from './exception/ServerDown.js';
import ServerError from './exception/ServerError.js';
import RequestTimeout from './exception/RequestTimeout.js'

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
  type: ['image/*', 'video/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip'],
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

app.post('/upload/zip', async (req, res) => {
  try{
    const url = req.originalUrl;
    if(url === '/upload/zip'){
      throw new NotImplemented("This feature is implemented yet");
    }
  } catch (error) {
    if (error instanceof NotImplemented) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
});

app.get('/download/zip', async (req, res) => {
  try{
    const url = req.originalUrl;
    if(url === '/download/zip'){
      throw new LockException("This feature is not locked for now");
    }
  } catch (error) {
    if (error instanceof LockException) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
});

app.get('/download/all', async (req, res) => {
  try{
    const url = req.originalUrl;
    if(url === '/download/all'){
      throw new NotAuthorized("Request unauthorized");
    }
  } catch (error) {
    if (error instanceof NotAuthorized) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
});

app.post('/upload/image', async (req, res) => {
  try {
    const image = req.body;
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleUpload(image,imageDirectory);
    clearTimeout(timeOut)
    res.status(200).json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/video', async (req, res) => {
  try {
    const video = req.body;
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleUpload(video,videoDirectory);
    clearTimeout(timeOut)
    res.status(200).json({ message: 'Video uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/pdf', async (req, res) => {
  try {
    const pdf = req.body;
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleUpload(pdf,pdfDirectory);
    clearTimeout(timeOut)
    res.status(200).json({ message: 'Pdf uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/word', async (req, res) => {
  try {
    const word = req.body;
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleUpload(word,wordDirectory);
    clearTimeout(timeOut)
    res.status(200).json({ message: 'Word uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/download/image', async (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).send('Filename parameter is required');
  }
  try {
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleDownload(filename,imageDirectory)
    clearTimeout(timeOut)
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/download/text', async (req, res) => {
  try{
    const url = req.originalUrl;
    if(url === '/download/image?filename=1'){
      throw new SensitiveFile("You are not allowed to download this file");
    }
  } catch (error) {
    if (error instanceof SensitiveFile) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
});

app.get('/download/texto', async (req, res) => {
  try{
    const url = req.originalUrl;
    if(url === '/download/image?filename=2'){
      throw new ServerDown("The server is down");
    }
  } catch (error) {
    if (error instanceof ServerDown) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
});

app.get('/download/test', async (req, res) => {
  try{
    const url = req.originalUrl;
    if(url === '/download/image?filename=3'){
      throw new ServerError("Could check the filename in the database");
    }
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    } else {
      console.error(error);
      throw new Error('Internal server error');
    }
  }
});

app.get('/download/video', async (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).send('Filename parameter is required');
  }
  try {
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleDownload(filename,videoDirectory);
    clearTimeout(timeOut)
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/download/pdf', async (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).send('Filename parameter is required');
  }
  try {
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleDownload(filename,pdfDirectory);
    clearTimeout(timeOut)
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/download/word', async (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).send('Filename parameter is required');
  }
  try {
    const time = 10000;
    const timeOut = setTimeout(() => {
      throw new RequestTimeout("Request timed out")
    }, time)
    const filePath = await handleDownload(filename,wordDirectory);
    clearTimeout(timeOut)
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
