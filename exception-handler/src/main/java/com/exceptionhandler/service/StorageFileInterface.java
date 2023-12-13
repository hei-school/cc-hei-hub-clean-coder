package com.exceptionhandler.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.TimeoutException;
import java.util.stream.Stream;

public interface StorageFileInterface {
    String store(MultipartFile file) throws TimeoutException;
    Stream<Path> loadFile();
    String deleteFile();
    Path load(String filename);
    String getFileFormat(MultipartFile file);
    String getFileExtension(MultipartFile file);
}
