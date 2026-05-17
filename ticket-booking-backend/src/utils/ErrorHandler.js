const {
    getInvalidRequestResponse,
    getNotFoundResponse,
    getUnAuthorizeResponse,
    getInternalServerErrorResponse,
    getGeneralResponse,
} = require("./Response");
const {
    InvalidRequestException,
    NotFoundException,
    UnAuthorizeException
} = require("./Exception");

module.exports = (err, req, res, next) => {
    console.error("ERROR: ", err);

    // Validation / Bad Request
    if (err instanceof InvalidRequestException) {
        return getGeneralResponse(
            res,
            getInvalidRequestResponse(err.message),
            null,
        );
    }

    // Not Found
    if (err instanceof NotFoundException) {
        return getGeneralResponse(
            res,
            getNotFoundResponse(err.message),
            null,
        );
    }

    // Unauthorized
    if (err instanceof UnAuthorizeException) {
        return getGeneralResponse(
            res,
            getUnAuthorizeResponse(err.message),
            null,
        );
    }

    // Fallback Internal Error
    return getGeneralResponse(res, getInternalServerErrorResponse(), null);
};
