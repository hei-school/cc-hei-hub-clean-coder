[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/wTBA-Etm)
# File Upload and Download Application

This is a simple Node.js application using the Express framework to handle file upload and download operations. The application supports various file types, including images, videos, PDFs, and Word documents.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hei-school/cc-hei-hub-clean-coder.git
   cd file-upload-download-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node app.js
   ```

The server will start running on port 3000.

## Usage

### Uploading Files

1. Open [Postman](https://www.postman.com/) or your preferred API testing tool.

2. Perform a POST request to one of the following endpoints based on the file type you want to upload:

   - Image: `http://localhost:3000/upload/image`
   - Video: `http://localhost:3000/upload/video`
   - PDF: `http://localhost:3000/upload/pdf`
   - Word: `http://localhost:3000/upload/word`

3. Set the request body to raw and select the file to upload. Ensure that the file type matches the endpoint you are using.

4. Execute the request.

### Downloading Files

1. Perform a GET request to one of the following endpoints based on the file type you want to download:

   - Image: `http://localhost:3000/download/image?filename=yourfilename`
   - Video: `http://localhost:3000/download/video?filename=yourfilename`
   - PDF: `http://localhost:3000/download/pdf?filename=yourfilename`
   - Word: `http://localhost:3000/download/word?filename=yourfilename`

   Replace `yourfilename` with the actual name of the file you want to download.

2. Execute the request.

## Testing

Ensure you have [Postman](https://www.postman.com/) installed to test the file upload and download functionality. Follow the steps mentioned in the "Usage" section to upload and download files.

## Technologies Used

- Express.js: A web application framework for Node.js used to handle HTTP requests and simplify the development of web applications.
