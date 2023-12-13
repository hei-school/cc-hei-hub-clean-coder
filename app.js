import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import {handleUpload} from './services/uploadHandler.js'
import {handleDownload} from './services/downloadHandler.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDirectory = path.join(__dirname, 'images');
const videoDirectory = path.join(__dirname, 'videos');
const pdfDirectory = path.join(__dirname, 'pdf');
const wordDirectory = path.join(__dirname, 'word');

const app = express();
const port = 3000; 

app.use(express.raw({type:['image/*','video/*','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],limit: '10mb'}));


app.post('/upload/image', async (req, res) => {
  try {
    const image = req.body;
    const filePath = await handleUpload(image,imageDirectory);
    res.status(200).json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/video', async (req, res) => {
  try {
    const video = req.body;
    const filePath = await handleUpload(video,videoDirectory);
    res.status(200).json({ message: 'Video uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/pdf', async (req, res) => {
  try {
    const pdf = req.body;
    const filePath = await handleUpload(pdf,pdfDirectory);
    res.status(200).json({ message: 'Pdf uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/word', async (req, res) => {
  try {
    const word = req.body;
    const filePath = await handleUpload(word,wordDirectory);
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
    const filePath = await handleDownload(filename,imageDirectory)
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
    const filePath = await handleDownload(filename,videoDirectory);
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
    const filePath = await handleDownload(filename,pdfDirectory);
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
    const filePath = await handleDownload(filename,wordDirectory)
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});