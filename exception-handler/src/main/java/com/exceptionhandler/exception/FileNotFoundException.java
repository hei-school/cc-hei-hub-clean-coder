package com.exceptionhandler.exception;

public class FileNotFoundException extends ApiException{

    public FileNotFoundException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
