package com.exceptionhandler.controller;

import com.exceptionhandler.service.FileService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;

import java.util.concurrent.TimeoutException;
import java.util.stream.Stream;

@AllArgsConstructor
@RestController
public class FileController {
    private final FileService service;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("fileType") String fileType,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            String responseMessage = "";
            switch (fileType) {
                case "document" -> responseMessage = service.storeDocument(file);
                case "video" -> responseMessage = service.storeVideo(file);
                case "image" -> responseMessage = service.storeImage(file);
                default -> {
                    return ResponseEntity.badRequest().body("Invalid file type provided.");
                }
            }
            return ResponseEntity.ok(responseMessage);
        } catch (TimeoutException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Timeout exception occurred.");
        }
    }
    
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
    public Stream<Path> loadAllFile(
            @RequestParam(value = "search", required = false) String searchQuery
    ) {
        Stream<Path> files = service.loadFile();
        if (searchQuery != null && !searchQuery.isEmpty()) {
            files = files.filter(path -> path.getFileName().toString().contains(searchQuery));
        }
        return files;
    }

     @GetMapping("/load-file")
    public Path loadFile(
            @RequestPart("file") String file
    ) throws TimeoutException {
        return service.load(file);
    } 
}
