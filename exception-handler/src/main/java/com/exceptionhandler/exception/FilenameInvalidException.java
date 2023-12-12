package com.exceptionhandler.exception;

public class FilenameInvalidException extends ApiException{
    public FilenameInvalidException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
