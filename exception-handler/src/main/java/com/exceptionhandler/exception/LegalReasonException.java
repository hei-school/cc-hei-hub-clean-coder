package com.exceptionhandler.exception;

public class LegalReasonException extends ApiException{
    public LegalReasonException(String message) {
        super(ExceptionType.CLIENT_EXCEPTION, message);
    }
}
