package com.exceptionhandler.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.TimeoutException;
import java.util.stream.Stream;

public interface StorageFileInterface {
    String storeDocument(MultipartFile file) throws TimeoutException;
    String storeVideo(MultipartFile file) throws TimeoutException;
    String storeImage(MultipartFile file) throws TimeoutException;
    Stream<Path> loadFile();
    String deleteFile(String searchQuery);
    Path load(String filename);
    String getFileFormat(MultipartFile file);
    String getFileExtension(MultipartFile file);
}
