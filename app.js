import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { handleUpload } from './services/uploadHandler.js';
import { handleDownload } from './services/downloadHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirectory = path.join(__dirname, 'images');
const videoDirectory = path.join(__dirname, 'videos');
const pdfDirectory = path.join(__dirname, 'pdf');
const wordDirectory = path.join(__dirname, 'word');

const app = express();
const port = 3000;

app.use(express.raw({
  type: ['image/*', 'video/*', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  limit: '10mb'
}));

const handleExceptions = async (req, res, handlerFunction, directory) => {
  try {
    const file = req.body;
    const filePath = await handlerFunction(file, directory);
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    if (error instanceof BadFileType || error instanceof CorruptedFile) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).send('Filename parameter is required');
  }
  try {
    const filePath = await handleDownload(filename, imageDirectory);
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/download/video', async (req, res) => {
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).send('Filename parameter is required');
  }
  try {
    const filePath = await handleDownload(filename, videoDirectory);
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
    const filePath = await handleDownload(filename, pdfDirectory);
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
    const filePath = await handleDownload(filename, wordDirectory);
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
