// Will allow to use all benefits of Error class and will generate custom errors depending ot the case
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;
