package com.exceptionhandler.exception;

public class ServerErrorException extends ApiException{

    public ServerErrorException(String message) {
        super(ExceptionType.SERVER_EXCEPTION, message);
    }

    public ServerErrorException(Exception source) {
        super(ExceptionType.CLIENT_EXCEPTION, source);
    }
}
