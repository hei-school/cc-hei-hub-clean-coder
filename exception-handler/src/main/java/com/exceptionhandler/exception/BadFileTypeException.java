package com.exceptionhandler.exception;

public class BadFileTypeException extends ApiException{

    public BadFileTypeException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
