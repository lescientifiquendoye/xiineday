package com.esp.xiineday.service.exception;

/**
 * Custom exception thrown when Meteomatics API calls fail or return invalid data.
 */
public class MeteomaticsApiException extends RuntimeException {
    public MeteomaticsApiException(String message) {
        super(message);
    }

    public MeteomaticsApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
