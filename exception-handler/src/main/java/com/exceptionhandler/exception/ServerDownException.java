package com.exceptionhandler.exception;

public class ServerDownException extends ApiException{
    public ServerDownException(String message) {
        super(ExceptionType.SERVER_EXCEPTION, message);
    }
}
