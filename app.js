import express from 'express';
import fs from 'fs/promises';
import {fileURLToPath} from 'url';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000; 

app.use(express.raw({limit: '10mb'}));

app.post('/upload/image', async (req, res) => {
  try {
    const image = req.body;
    const type = await fileTypeFromBuffer(image);

    if (!type || !type.mime.startsWith("image/")) {
      throw new Error('Invalid image file');
    }

    if (req.body.length > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB');
    }

    const directory = path.join(__dirname, 'images');
    const filename = `${Date.now()}.png`;
    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, image);
    res.status(200).json({ message: 'Image uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/video', async (req, res) => {
  try {
    const video = req.body;
    const type = await fileTypeFromBuffer(video);

    if (!type || !type.mime.startsWith("video/")) {
      throw new Error('Invalid video file');
    }

    if (req.body.length > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB');
    }
    
    const directory = path.join(__dirname, 'videos');
    const filename = `${Date.now()}.mp4`;
    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, video);
    res.status(200).json({ message: 'Video uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/pdf', async (req, res) => {
  try {
    const pdf = req.body;
    const type = await fileTypeFromBuffer(pdf);

    if (!type || type.mime != "application/pdf") {
      throw new Error('Invalid pdf file');
    }

    if (req.body.length > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB');
    }
    
    const directory = path.join(__dirname, 'pdf');
    const filename = `${Date.now()}.pdf`;
    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, pdf);
    res.status(200).json({ message: 'Pdf uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/upload/word', async (req, res) => {
  try {
    const word = req.body;
    const type = await fileTypeFromBuffer(word);

    if (!type || type.mime != "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      throw new Error('Invalid word file');
    }

    if (req.body.length > 10 * 1024 * 1024) {
      throw new Error('Image size exceeds 10MB');
    }
    
    const directory = path.join(__dirname, 'word');
    const filename = `${Date.now()}.docx`;
    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, word);
    res.status(200).json({ message: 'Word uploaded successfully', filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});