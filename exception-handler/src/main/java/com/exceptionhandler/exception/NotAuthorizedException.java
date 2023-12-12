package com.exceptionhandler.exception;

public class NotAuthorizedException extends ApiException{


    public NotAuthorizedException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
