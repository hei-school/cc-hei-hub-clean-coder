package com.exceptionhandler.exception;

public class DuplicatedFileException extends ApiException{

    public DuplicatedFileException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
