package com.exceptionhandler.exception;

public class CorruptedFileException extends ApiException{

    public CorruptedFileException(String message) {
        super(ExceptionType.SERVER_EXCEPTION, message);
    }
}
