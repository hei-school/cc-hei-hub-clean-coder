package com.exceptionhandler.exception;

public class TooManyRequestException extends ApiException{
    public TooManyRequestException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }

    public TooManyRequestException(Exception source) {
        super(ExceptionType.CLIENT_EXCEPTION, source);
    }
}
