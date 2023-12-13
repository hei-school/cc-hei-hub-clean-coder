package com.exceptionhandler.service;

import com.exceptionhandler.exception.ApiException;
import com.exceptionhandler.exception.BadFileTypeException;
import com.exceptionhandler.exception.FileNotFoundException;
import com.exceptionhandler.exception.NotAuthorizedException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.concurrent.TimeoutException;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class FileService implements StorageFileInterface{
    private final Path rootLocation = Paths.get("uploads");
    @Override
    public String storeDocument(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("File should not be empty");
            } else {
                String format = getFileFormat(file);
                if (!format.equals("document")) {
                    throw new BadFileTypeException("Only document files are allowed");
                }
                Path documentDirectory = this.rootLocation.resolve("document");
                Path destinationFile = documentDirectory.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename()))).normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    Files.createDirectories(documentDirectory);
                    Files.copy(inputStream, destinationFile);
                }
                return "Document stored successfully";
            }
        } catch (ApiException | IOException e) {
            throw new NotAuthorizedException("Bad format of file , must be a document file");
        }
    }

    @Override
    public String storeVideo(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("File should not be empty");
            } else {
                String format = getFileFormat(file);
                if (!format.equals("video")) {
                    throw new BadFileTypeException("Only video files are allowed");
                }
                Path videoDirectory = this.rootLocation.resolve("videos");
                Path destinationFile = videoDirectory.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename()))).normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    Files.createDirectories(videoDirectory);
                    Files.copy(inputStream, destinationFile);
                }
                return "Video stored successfully";
            }
        } catch (ApiException | IOException e) {
            throw new NotAuthorizedException("Bad format of file , must be a video file");
        }
    }

    @Override
    public String storeImage(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("File should not be empty");
            } else {
                String format = getFileFormat(file);
                if (!format.equals("image")) {
                    throw new BadFileTypeException("Only image files are allowed");
                }
                Path imgDirectory = this.rootLocation.resolve("img");
                Path destinationFile = imgDirectory.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename()))).normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    Files.createDirectories(imgDirectory);
                    Files.copy(inputStream, destinationFile);
                }
                return "Image stored successfully";
            }
        } catch (ApiException | IOException e) {
            throw new NotAuthorizedException("Bad format of file , must be a image file");
        }
    }

    @Override
    public Stream<Path> loadFile() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (ApiException | IOException e) {
            throw new FileNotFoundException("Failed to read stored files");
        }
    }

    @Override
    public String deleteFile() {
        return null;
    }

    @Override
    public Path load(String filename) {
        return this.rootLocation.resolve(filename);
    }

    @Override
    public String getFileFormat(MultipartFile file) {
        String contentType = file.getContentType();
        assert contentType != null;
        if (contentType.startsWith("image")) {
            return "image";
        } else if (contentType.startsWith("video")) {
            return "video";
        } else if (contentType.startsWith("application/pdf") || contentType.startsWith("text")) {
            return "document";
        } else {
            throw new NotAuthorizedException("bad format of file");
        }
    }


    @Override
    public String getFileExtension(MultipartFile file) {
        String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
        String[] parts = originalFilename.split("\\.");
        String extension = parts[parts.length - 1].toLowerCase();

        if (parts.length > 2) {
            throw new BadFileTypeException("Invalid extension");
        }

        return extension;
    }
}
