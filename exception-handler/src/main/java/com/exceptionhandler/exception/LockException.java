package com.exceptionhandler.exception;

public class LockException extends ApiException{
    public LockException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
