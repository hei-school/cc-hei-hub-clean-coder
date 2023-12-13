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
    
    @PostMapping("/upload-document")
    public String storeDocument (
            @RequestPart("file") MultipartFile file
            ) throws TimeoutException {
        return service.storeDocument(file);
    }

        @PostMapping("/upload-video")
    public String storeVideo(
            @RequestPart("file") MultipartFile file
    ) throws TimeoutException {
        return service.storeVideo(file);
    }

    @PostMapping("/upload-image")
    public String storeImage(
            @RequestPart("file") MultipartFile file
    ) throws TimeoutException {
        return service.storeImage(file);
    }
    
    @GetMapping("/files")
    public Stream<Path> loadAllFile(){
        return service.loadFile();
    }

     @GetMapping("/load-file")
    public Path loadFile(
            @RequestPart("file") String file
    ) throws TimeoutException {
        return service.load(file);
    } 
}
