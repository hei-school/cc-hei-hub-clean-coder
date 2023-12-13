package com.exceptionhandler.controller;

import com.exceptionhandler.service.FileService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;

import java.util.concurrent.TimeoutException;

@AllArgsConstructor
@RestController
public class FileController {
    private final FileService service;
    
    @PostMapping("/upload")
    public String storeFile (
            @RequestPart("file") MultipartFile file
            ) throws TimeoutException {
        return service.store(file);
    }

     @GetMapping("/load-all-file")
    public Stream<Path> loadAllFile(){
        return service.loadFile();
    }

    @DeleteMapping("/delete-file")
    public String deleteFile(){
        return service.deleteFile();
    }

    @GetMapping("/load-file")
    public Path loadFile(
            @RequestPart("file") String file
    ) throws TimeoutException {
        return service.load(file);
    }

    @GetMapping("/format-file")
    public String getFormatFile(
            @RequestPart("file") MultipartFile file
    ){
        return service.getFileFormat(file);
    }

    @GetMapping("/file-extension")
    public String getFormatFile(
            @RequestPart("file") MultipartFile file
    ){
        return service.getFileExtension(file);
    }
}
