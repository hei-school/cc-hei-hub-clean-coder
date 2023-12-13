[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/wTBA-Etm)

# File Upload and Download Application

This project is a Java application based on Spring Boot, which uses the Spring MVC framework to manage file upload and download functionalities. The application enables users to manipulate different file types such as images, videos, PDFs and Word documents.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hei-school/cc-hei-hub-clean-coder.git
   cd file-upload-download-app
   git checkout feature/java
   ```

2. Install dependencies:
   ```bash
   Install jdk 17 installer : https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe
   ```

3. Start the server:
   To start the server, open the folder in IDEA and launch the application. Once launched, you can access it via
   ```bash
   http://localhost:8080/
   ```


## Usage

### Uploading Files

1. Open [Postman](https://www.postman.com/) or your preferred API testing tool.

2. Perform a POST request to one of the following endpoints based on the file type you want to upload:

   - Image: `http://localhost:8080/upload-image`
   - Video: `http://localhost:8080/upload-video`
   - Document : `http://localhost:8080/upload-document`

3. Execute the request.

### Downloading Files

1. Perform a GET request to one of the following endpoints to download:

   - One file : `http://localhost:8080/load-file`
   - All files: `http://localhost:8080/files`

2. Execute the request.

### Deleting Files

1. Perform a DELETE request to delete file :

   - http://localhost:8080/delete-file
  
2. Execute the request.

## Testing

Ensure you have [Postman](https://www.postman.com/) installed to test the file upload and download functionality. Follow the steps mentioned in the "Usage" section to upload and download files.

## Programming Language
Java
 ```bash
   Version : 17 
   ```
