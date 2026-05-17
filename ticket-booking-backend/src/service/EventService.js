const MessageConstant = require("../constant/MessageConstant");
const EventRepository = require("../repository/EventRepository");
const { InvalidRequestException, NotFoundException } = require("../utils/Exception");

class EventService {
    async addEvent(data) {
        try {
            if (!data)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await EventRepository.addEvent(data);
            return { success: true, body: result.dataValues };
        } catch (error) {
            throw error;
        }
    }

    async getEventById(id) {
        try {
            if (!id)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await EventRepository.getEventById(id);
            if (!result)
                throw new InvalidRequestException(
                    MessageConstant.NO_DATA_FOUND,
                );
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async updateEventById(id, data) {
        try {
            if (!id || !data)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const [, updatedResult] = await EventRepository.updateEventById(
                id,
                data,
            );
            return { success: true, body: updatedResult?.[0] || null };
        } catch (error) {
            throw error;
        }
    }

    async deleteEventById(id) {
        try {
            if (!id)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await EventRepository.deleteEventById(id);
            if (!result?.[0]) {
                throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
            }
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async getAllEvent(isAdminEvent, isEventPage) {
        try {
            const result = await EventRepository.getAllEvent(isAdminEvent, isEventPage);
            return { success: true, body: result }
        } catch (error) {
            throw error;
        }
    }

    async getEventListByFilterSort(req) {
        try {
            if (!req || !req?.filter)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await EventRepository.getEventListByFilterSort(
                req?.filter,
                req?.sort,
                req?.page,
            );
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EventService();
