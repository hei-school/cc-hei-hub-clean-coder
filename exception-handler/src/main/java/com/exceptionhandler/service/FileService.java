package com.exceptionhandler.service;

import com.exceptionhandler.exception.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileService implements StorageFileInterface{

    private final Path rootLocation = Paths.get("uploads");

    public FileService() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
            Path documentLocation = rootLocation.resolve("document");
            if (!Files.exists(documentLocation)) {
                Files.createDirectories(documentLocation);
            }
            Path imgLocation = rootLocation.resolve("img");
            if (!Files.exists(imgLocation)) {
                Files.createDirectories(imgLocation);
            }
            Path videosLocation = rootLocation.resolve("videos");
            if (!Files.exists(videosLocation)) {
                Files.createDirectories(videosLocation);
            }
        } catch (IOException e) {
            throw new InsufficientStorageException("Failed to create directories for file storage");
        }
    }

    @Override
    public String storeDocument(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("Le fichier ne doit pas être vide");
            } else {
                String format = getFileFormat(file);
                if (!format.equals("document")) {
                    throw new BadFileTypeException("Seuls les fichiers de document sont autorisés");
                }
                Path documentDirectory = this.rootLocation.resolve("document");
                Path destinationFile = documentDirectory.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename()))).normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    if (Files.exists(destinationFile)) {
                        throw new TooManyRequestException("document already exists");
                    }
                    Files.createDirectories(documentDirectory);
                    Files.copy(inputStream, destinationFile);
                }
                return "Document stocké avec succès";
            }
        } catch (ApiException | IOException e) {
            throw new TooManyRequestException("document already exists");
        }
    }

    @Override
    public String storeVideo(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("Le fichier ne doit pas être vide");
            } else {
                String format = getFileFormat(file);
                if (!format.equals("video")) {
                    throw new BadFileTypeException("Seuls les fichiers vidéo sont autorisés");
                }
                Path videoDirectory = this.rootLocation.resolve("videos");
                Path destinationFile = videoDirectory.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename()))).normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    if (Files.exists(destinationFile)) {
                        throw new TooManyRequestException("video already exists");
                    }
                    Files.createDirectories(videoDirectory);
                    Files.copy(inputStream, destinationFile);
                }
                return "Vidéo stockée avec succès";
            }
        } catch (ApiException | IOException e) {
            throw new TooManyRequestException("video already exists");
        }
    }

    @Override
    public String storeImage(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("Le fichier ne doit pas être vide");
            } else {
                String format = getFileFormat(file);
                if (!format.equals("image")) {
                    throw new BadFileTypeException("Seuls les fichiers image sont autorisés");
                }
                Path imgDirectory = this.rootLocation.resolve("img");
                Path destinationFile = imgDirectory.resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename()))).normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    if (Files.exists(destinationFile)) {
                        throw new TooManyRequestException("image already exists");
                    }
                    Files.createDirectories(imgDirectory);
                    Files.copy(inputStream, destinationFile);
                }
                return "Image stockée avec succès";
            }
        } catch (ApiException | IOException e) {
            throw new TooManyRequestException("image already exists");
        }
    }

    @Override
    public Stream<Path> loadFile() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (ApiException | IOException e) {
            throw new FileNotFoundException("Impossible de lire les fichiers stockés");
        }
    }

    @Override
    public String deleteFile(String searchQuery) {
        try {
            Stream<Path> files = loadFile();
            List<Path> filesToDelete = files.filter(path -> path.getFileName().toString().contains(searchQuery)).collect(Collectors.toList());
            for (Path file : filesToDelete) {
                Files.deleteIfExists(file);
            }
            return "Fichiers supprimés avec succès";
        } catch (IOException e) {
            throw new FileNotFoundException("Impossible de supprimer les fichiers");
        }
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
            throw new NotAuthorizedException("Mauvais format de fichier");
        }
    }

    @Override
    public String getFileExtension(MultipartFile file) {
        String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
        String[] parts = originalFilename.split("\\.");
        String extension = parts[parts.length - 1].toLowerCase();

        if (parts.length > 2) {
            throw new BadFileTypeException("Extension invalide");
        }

        return extension;
    }
}
