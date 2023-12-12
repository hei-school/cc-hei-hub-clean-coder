package com.exceptionhandler.exception;

public class FileTooLargeException extends ApiException{

    public FileTooLargeException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
