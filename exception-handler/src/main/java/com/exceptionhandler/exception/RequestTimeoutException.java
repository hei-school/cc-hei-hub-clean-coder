package com.exceptionhandler.exception;

public class RequestTimeoutException extends ApiException{
    public RequestTimeoutException(String message) {
        super(ExceptionType.SERVER_EXCEPTION, message);
    }
}
