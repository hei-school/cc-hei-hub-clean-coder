package com.exceptionhandler.service.validator;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@AllArgsConstructor
public class SizeValidator {
    private static final long MAX_SIZE = 10;
    public boolean isInSize(MultipartFile file){
        return file.getSize() <= MAX_SIZE;
    }
}
