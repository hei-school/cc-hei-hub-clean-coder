import { fileTypeFromBuffer } from 'file-type/core';
import path from 'path';
import fs from 'fs/promises';


export const handleUpload = async (file,directory) =>{
    const type = await fileTypeFromBuffer(file);
  
    if (file.length > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB');
    }
  
    if (!type || (!type.mime.startsWith("video/") && !type.mime.startsWith("image/") && type.mime != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && type.mime != "application/pdf")) {
      throw new Error('Invalid file extension');
    }
  
    const filename = `${Date.now()}.${type.ext}`;
    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, file);
    return filePath;
  }