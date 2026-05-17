const EventService = require("../service/EventService");
const MessageConstant = require("../constant/MessageConstant");
const {
    getOkResponse,
    getInvalidRequestResponse,
    getGeneralResponse,
} = require("../utils/Response");

class EventController {
    addEvent = async (req, res, next) => {
        try {
            const userId = req?.user?.data?.id;
            const result = await EventService.addEvent(req?.body, userId);
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.EVENT_ADDED_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in addEvent: ", error);
            next(error);
        }
    };

    getEventById = async (req, res, next) => {
        try {
            const result = await EventService.getEventById(req?.params?.id);
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.EVENTS_FOUND_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in getEventById: ", error);
            next(error);
        }
    };

    updateEventById = async (req, res, next) => {
        try {
            const result = await EventService.updateEventById(
                req?.params?.id,
                req?.body,
            );
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.EVENT_UPDATED_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in updateEventById: ", error);
            next(error);
        }
    };

    deleteEventById = async (req, res, next) => {
        try {
            const result = await EventService.deleteEventById(req?.params?.id);
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.EVENT_DELETED_SUCCESSFULLY),
                null
            );
        } catch (error) {
            console.log("Error in deleteEventById: ", error);
            next(error);
        }
    };

    getAllEvent = async (req, res, next) => {
        try {
            const { isAdminEvent, isEventPage } = req.body
            const result = await EventService.getAllEvent(isAdminEvent, isEventPage);

            if (!result?.success) {
                return getGeneralResponse(
                    res, null, getInvalidRequestResponse(result?.body)
                );
            }

            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.EVENTS_FOUND_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in getAllEvent: ", error);
            next(error);
        }
    };

    getEventListByFilterSort = async (req, res, next) => {
        try {
            const result = await EventService.getEventListByFilterSort(
                req?.body,
            );
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.EVENTS_FOUND_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in getEventListByFilterSort: ", error);
            next(error);
        }
    };
}

module.exports = new EventController();
