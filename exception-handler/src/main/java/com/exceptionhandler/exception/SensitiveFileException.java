package com.exceptionhandler.exception;

public class SensitiveFileException extends ApiException{

    public SensitiveFileException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
