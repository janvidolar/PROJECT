const MessageConstant = require("../constant/MessageConstant");
const { formatStatus } = require("../helper/DataHelper");
const TicketRepository = require("../repository/TicketRepository");
const {
    InvalidRequestException,
    NotFoundException,
} = require("../utils/Exception");
const ExcelJS = require("exceljs");

class TicketService {
    async addTicket(data) {
        try {
            if (!data)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.addTicket(data);
            return { success: true, body: result.dataValues };
        } catch (error) {
            throw error;
        }
    }

    async getTicketByUserId(userId) {
        try {
            if (!userId)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.getTicketByUserId(userId);
            if (!result)
                throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async updateTicketById(id, data) {
        try {
            if (!id || !data)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const [, updatedResult] = await TicketRepository.updateTicketById(
                id,
                data,
            );
            return { success: true, body: updatedResult?.[0] || null };
        } catch (error) {
            throw error;
        }
    }

    async deleteTicketById(id) {
        try {
            if (!id)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.deleteTicketById(id);
            if (!result?.[0]) {
                throw new NotFoundException(MessageConstant.NO_DATA_FOUND);
            }
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async getAllTicket() {
        try {
            const result = await TicketRepository.getAllTicket();
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async getTicketListByFilterSort(req) {
        try {
            if (!req || !req?.filter)
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST_DESCRIPTION,
                );
            const result = await TicketRepository.getTicketListByFilterSort(
                req?.filter,
                req?.sort,
                req?.page,
            );
            return { success: true, body: result };
        } catch (error) {
            throw error;
        }
    }

    async getTicket(id){
        try{
            if(!id){
                throw new InvalidRequestException(
                    MessageConstant.INVALID_REQUEST,

                )
            }
            return await TicketRepository.getTicket(id);
        }catch(err){
            throw err
        }
    }

    async exportExcelTickets(req) {
        if (!req || !req?.filter)
            throw new InvalidRequestException(
                MessageConstant.INVALID_REQUEST_DESCRIPTION,
            );
        const tickets = await TicketRepository.getTicketListByFilterSort(
            { ...req?.filter, isSkipPagination: true },
            req?.sort,
            req?.page,
        );
        if (!tickets.length) {
            throw new NotFoundException(MessageConstant.TICKET_NOT_FOUND);
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tickets");
        worksheet.columns = [
            { header: "Sr No.", width: 8 },
            { header: "User Name", width: 12 },
            { header: "Event Name", width: 25 },
            { header: "Event Date", width: 18 },
            { header: "Event Time", width: 15 },
            { header: "Tickets", width: 20 },
            { header: "Status", width: 15 },
        ];
        const naValue = "N/A"
        tickets?.forEach((ticket, index) => {
            const ticketDataValues = ticket?.dataValues || ticket
            worksheet.addRow([
                index + 1,
                ticketDataValues?.user?.name || naValue,
                ticketDataValues?.event?.title || naValue,
                ticketDataValues?.event?.date || naValue,
                ticketDataValues?.event?.time || naValue,
                (ticketDataValues?.seats && Array.isArray(ticketDataValues?.seats))
                    ? ticketDataValues?.seats?.join(", ")
                    : naValue,
                formatStatus(ticketDataValues?.event?.status, naValue),
            ]);
        });

        worksheet.getRow(1).font = { bold: true };

        return workbook.xlsx.writeBuffer();
    }

}

module.exports = new TicketService();
