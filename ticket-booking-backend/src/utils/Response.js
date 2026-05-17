const MessageConstant = require("../constant/MessageConstant");

class Response {
    constructor(code, status, description) {
        this.code = code;
        this.status = status;
        this.description = description;
    }
}

function getOkResponse(message) {
    return new Response(200, MessageConstant.OK, message);
}

function getCreatedResponse(message) {
    return new Response(201, MessageConstant.CREATED, message);
}

function getUpdatedResponse(message) {
    return new Response(200, MessageConstant.UPDATED, message);
}

function getDeletedResponse(message) {
    return new Response(200, MessageConstant.DELETED, message);
}

function getInvalidRequestResponse(message) {
    return new Response(400, MessageConstant.ERROR, message);
}

function getNotFoundResponse(message = MessageConstant.NO_DATA_FOUND) {
    return new Response(404, MessageConstant.ERROR, message);
}

function getUnAuthorizeResponse(message) {
    return new Response(401, MessageConstant.ERROR, message);
}

function getInternalServerErrorResponse() {
    return new Response(
        500,
        MessageConstant.ERROR,
        MessageConstant.SOMETHING_WENT_WRONG,
    );
}

function getGeneralResponse(res, meta, data = null) {
    return res.status(meta.code).json({
        status: meta.status,
        code: meta.code,
        description: meta.description,
        data: data,
    });
}

function getPaginationResponse(data, page) {
    const { pageNumber = 0, pageLimit = 10 } = page || {};
    const totalElements = data?.count || 0;
    return {
        content: data?.rows || [],
        pageable: { pageNumber, pageLimit },
        totalElements,
        totalPages: Math.ceil(totalElements / pageLimit),
    };
}

module.exports = {
    getOkResponse,
    getCreatedResponse,
    getUpdatedResponse,
    getDeletedResponse,
    getInvalidRequestResponse,
    getNotFoundResponse,
    getInternalServerErrorResponse,
    getUnAuthorizeResponse,
    getPaginationResponse,
    getGeneralResponse
};
