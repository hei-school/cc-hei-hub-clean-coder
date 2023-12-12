package com.exceptionhandler.service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageFileInterface {
    String store(MultipartFile file);
    Stream<Path> loadFile();
    String deleteFile();
    Path load(String filename);
    String getFileFormat(MultipartFile file);
    String getFileExtension(MultipartFile file);
}
