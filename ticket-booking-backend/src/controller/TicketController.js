const TicketService = require("../service/TicketService");
const MessageConstant = require("../constant/MessageConstant");
const {
    getOkResponse,
    getGeneralResponse,
} = require("../utils/Response");
const { NotFoundException } = require("../utils/Exception");

class TicketController {
    addTicket = async (req, res, next) => {
        try {
            const result = await TicketService.addTicket(req?.body);
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.TICKET_ADDED_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in addTicket:", error);
            next(error);
        }
    };

    getTicketByUserId = async (req, res, next) => {
        try {
            const result = await TicketService.getTicketByUserId(req?.params?.userId);
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.SUCCESS),
                result.body
            );
        } catch (error) {
            console.log("Error in getTicketById:", error);
            next(error);
        }
    };

    updateTicketById = async (req, res, next) => {
        try {
            const result = await TicketService.updateTicketById(
                req?.params?.id,
                req?.body,
            );
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.TICKET_UPDATED_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in updateTicketById:", error);
            next(error);
        }
    };

    deleteTicketById = async (req, res, next) => {
        try {
            const result = await TicketService.deleteTicketById(
                req?.params?.id,
            );
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.TICKET_DELETED_SUCCESSFULLY),
                null
            );
        } catch (error) {
            console.log("Error in deleteTicketById:", error);
            next(error);
        }
    };

    getAllTicket = async (req, res, next) => {
        try {
            const result = await TicketService.getAllTicket();
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.TICKETS_FOUND_SUCCESSFULLY),
                result.body
            );
        } catch (error) {
            console.log("Error in getAllTicket:", error);
            next(error);
        }
    };

    getTicketListByFilterSort = async (req, res, next) => {
        try {
            const result = await TicketService.getTicketListByFilterSort(
                req?.body,
            );
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.SUCCESS),
                result.body
            );
        } catch (error) {
            console.log("Error in getTicketListByFilterSort:", error);
            next(error);
        }
    };

    getTicket = async(req,res,next)=>{
        try{
            const result=await TicketService.getTicket(req?.params?.id)
            return getGeneralResponse(
                res,
                getOkResponse(MessageConstant.SUCCESS)
            )
        }catch(error){
           // console.log("Error in getTicket:",error);
            next(error);
        }
    }

    exportExcelTickets = async (req, res, next) => {
        try {
            const buffer = await TicketService.exportExcelTickets(req?.body);
            if (!buffer)
                throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
            res.status(200);
            res.setHeader(
                "Content-Disposition",
                'attachment; filename="Tickets.xlsx"',
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            return res.status(200).send(buffer);
        } catch (error) {
            console.log("Error in exportExcelTickets:", error);
            next(error);
        }
    };
}

module.exports = new TicketController();
