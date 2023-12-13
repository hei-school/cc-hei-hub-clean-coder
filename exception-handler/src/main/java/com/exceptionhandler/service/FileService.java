package com.exceptionhandler.service;

import com.exceptionhandler.exception.FileNotFoundException;
import com.exceptionhandler.service.validator.SizeValidator;
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
    private final SizeValidator validator;
    private final Path rootLocation = Paths.get("uploads");
    @Override
    public String store(MultipartFile file) throws TimeoutException {
        try {
            if (file.isEmpty()) {
                throw new FileNotFoundException("Fichier ne devrait pas être vide");
            }
            else{
                Path destinationFile = this.rootLocation.resolve(
                                Paths.get(Objects.requireNonNull(file.getOriginalFilename())))
                                .normalize().toAbsolutePath();
                try (InputStream inputStream = file.getInputStream()) {
                    Files.copy(
                            inputStream,
                            destinationFile
                    );
                }
                return "success";
            }
        } catch (IOException e) {
            throw new TimeoutException("Connexion lost");
        }
    }

    @Override
    public Stream<Path> loadFile() {
        return null;
    }

    @Override
    public String deleteFile() {
        return null;
    }

    @Override
    public Path load(String filename) {
        return null;
    }

    @Override
    public String getFileFormat(MultipartFile file) {
        return null;
    }

    @Override
    public String getFileExtension(MultipartFile file) {
        return null;
    }
}
